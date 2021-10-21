import "./Form.css";
import store from "../../store/train";
import _ from "lodash";
import { Button, Dropdown, Popup } from "semantic-ui-react";
import { useDispatch } from "react-redux";
import DigitrafficService from "../../services/DigitrafficService";
import { bindActionCreators } from "redux";
import { withTranslation, useTranslation } from 'react-i18next';
import { connect } from "react-redux";
import {
  updateAllTrains,
  updateTrainInfo,
  isAllTrainsSelected,
  trackTheTrain,
  updateCurrentTrain
} from "../../store/features/trainSlicer";

function TrainSlider() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  function handleCheckBoxSelect(event, data) {
    dispatch(isAllTrainsSelected(event.target.checked));
    storeAllTrains(dispatch);
  }
  return (
    <div className="ui slider checkbox form-item">
      <input onChange={handleCheckBoxSelect} type="checkbox" name="newsletter" />
      <label>{t('show-all-trains')}</label>
    </div>
  );
}

function TrackTrainSlider() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  function handleCheckBoxSelect(event, data) {
    dispatch(trackTheTrain(event.target.checked));
    console.log(event.target.checked)
  }
  return (
    <div className="ui slider checkbox form-item">
      <input onChange={handleCheckBoxSelect} type="checkbox" name="newsletter" />
      <label>{t('track-the-train')}</label>
      <Popup inverted content={t('update-trains-popup-text')} trigger={<i className='info circle icon red'></i>} />
    </div>
  );
}

function UpdateTrainsForm(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  function handleDropDownSelect(event, data) {
    getLatestCoordinatForTrain(data.value, dispatch);
    getLatestInfoForTrain(data.value, dispatch);
  }
  let uniqTrains = _.uniqBy(props.allTrains, 'key');
  return (
    <div>
      <div className="sliders">
          <div></div>
          <div>
            <Dropdown
              className="dropdown-trains form-item"
              onChange={handleDropDownSelect}
              placeholder={t('select-train')}
              search
              selection
              options={uniqTrains}
            />
            <TrainSlider></TrainSlider>
            <TrackTrainSlider ></TrackTrainSlider>
            
        </div>
        <div></div>
      </div>
      <div className="btn-update btn-grid">
        <div></div>
        <Button
          aria-label={props.name}
          onClick={() => {
            storeAllTrains(dispatch);
          }}
        >
          {props.name}
        </Button>
        <div></div>
      </div>
    </div>
  );
}

//functio jossa asetetaan dispatchilla trainId etc
function getLatestCoordinatForTrain(trainNumber, dispatch) {
  DigitrafficService.getLatestCoordinate(trainNumber)
    .then((data) => {
      if (data && data.length > 0) {
        dispatch(updateCurrentTrain(data[0]));
        if (store.getState().train.allTrains.length === 0) {
          storeAllTrains(dispatch);
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

//functio jossa asetetaan dispatchilla trainId etc
function getLatestInfoForTrain(trainNumber, dispatch) {
  DigitrafficService.getLatestTrainInfo(trainNumber)
    .then((data) => {
      if (data && data.length > 0) {
        dispatch(updateTrainInfo(data));
        if (store.getState().train.allTrains.length === 0)
          storeAllTrains(dispatch);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

//functio jossa asetetaan dispatchilla trainId etc
function storeAllTrains(dispatch) {
  DigitrafficService.getLatestCoordinateAll()
    .then((data) => {
      if (data && data.length > 0) {
        dispatch(updateAllTrains(data));
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

function mapStateToProps(state) {
  return {
    trackTheTrain: state.trackTheTrain
  };
}
export default (connect(mapStateToProps, mapDispatchToProps), withTranslation())(UpdateTrainsForm);
