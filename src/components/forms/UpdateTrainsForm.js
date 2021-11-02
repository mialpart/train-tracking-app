import "./Form.css";
import TrainDropDown from './TrainDropDown';
import { Button, Popup } from "semantic-ui-react";
import { useDispatch } from "react-redux";
import { storeAllTrains } from "../../utils/functions/Trains";
import { withTranslation, useTranslation } from "react-i18next";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
  isAllTrainsSelected,
  trackTheTrain,
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
      <input
        onChange={handleCheckBoxSelect}
        type="checkbox"
        name="newsletter"
      />
      <label>{t("show-all-trains")}</label>
    </div>
  );
}

function TrackTrainSlider() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  function handleCheckBoxSelect(event, data) {
    dispatch(trackTheTrain(event.target.checked));
    console.log(event.target.checked);
  }
  return (
    <div className="ui slider checkbox form-item">
      <input
        onChange={handleCheckBoxSelect}
        type="checkbox"
        name="newsletter"
      />
      <label>{t("track-the-train")}</label>
      <Popup
        inverted
        content={t("update-trains-popup-text")}
        trigger={<i className="info circle icon red"></i>}
      />
    </div>
  );
}



function UpdateTrainsForm(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  
  return (
    <div>
      <div className="sliders">
        <div></div>
        <div>
          <TrainDropDown allTrains={props.allTrains} currentTrain={props.currentTrain}></TrainDropDown>
          <TrainSlider></TrainSlider>
          <TrackTrainSlider></TrackTrainSlider>
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

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

function mapStateToProps(state) {
  return {
    trackTheTrain: state.trackTheTrain,
  };
}
export default (connect(mapStateToProps, mapDispatchToProps),
withTranslation())(UpdateTrainsForm);
