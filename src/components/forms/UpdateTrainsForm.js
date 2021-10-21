import "./Form.css";
import store from "../../store/train";
import _ from "lodash";
import { Button, Dropdown, Icon, Popup } from "semantic-ui-react";
import { useDispatch } from "react-redux";
import DigitrafficService from "../../services/DigitrafficService";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
  updateAllTrains,
  updateTrainInfo,
  isAllTrainsSelected,
  trackTheTrain,
  updateCurrentTrain
} from "../../store/features/trainSlicer";

function TrainSlider() {
  const dispatch = useDispatch();
  function handleCheckBoxSelect(event, data) {
    dispatch(isAllTrainsSelected(event.target.checked));
    storeAllTrains(dispatch);

    console.log(event.target.checked)
  }
  return (
    <div className="ui slider checkbox form-item">
      <input onChange={handleCheckBoxSelect} type="checkbox" name="newsletter" />
      <label>Näytä kaikki junat kartalla</label>
    </div>
  );
}

function TrackTrainSlider() {
  const dispatch = useDispatch();
  function handleCheckBoxSelect(event, data) {
    dispatch(trackTheTrain(event.target.checked));
    console.log(event.target.checked)
  }
  return (
    <div className="ui slider checkbox form-item">
      <input onChange={handleCheckBoxSelect} type="checkbox" name="newsletter" />
      <label>Seuraa junaa <Popup inverted content='Päivittää valitun junan tai kaikkien junien tiedot 5 sekunnin välein.' trigger={<i className='info circle icon red'></i>} /></label>
    </div>
  );
}

function UpdateTrainsForm(props) {
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
              placeholder="Valitse juna"
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
        let coordinate = [
          data[0].location.coordinates[1],
          data[0].location.coordinates[0],
        ];
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
export default connect(mapStateToProps, mapDispatchToProps)(UpdateTrainsForm);
