import _ from "lodash";
import { useTranslation } from "react-i18next";
import { storeAllTrains } from "../../utils/functions/Trains";
import { useDispatch } from "react-redux";
import { Dropdown } from "semantic-ui-react";
import DigitrafficService from "../../services/DigitrafficService";
import store from "../../store/train";
import {
    updateTrainInfo,
    updateCurrentTrain,
  } from "../../store/features/trainSlicer";

  
export default function TrainDropDown (props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  let uniqTrains = _.uniqBy(props.allTrains, "key");
  function handleDropDownSelect(event, data) {
    getLatestCoordinatForTrain(data.value, dispatch);
    getLatestInfoForTrain(data.value, dispatch);
  }
  console.log(props.currentTrain)
  return (
    <Dropdown
      className="dropdown-trains form-item"
      onChange={handleDropDownSelect}
      placeholder={t("select-train")}
      search
      selection
      options={uniqTrains}
    />
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

