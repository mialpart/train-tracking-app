import DigitrafficService from "../../services/DigitrafficService";
import _ from "lodash";
import { updateAllTrains } from "../../store/features/trainSlicer";

//functio jossa asetetaan dispatchilla trainId etc
export const storeAllTrains = (dispatch) => {
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

export const getAllDropDownTrains = (allTrains, allTrainInfoToday) => {
  let newAllTrains = [];
  if (allTrains && allTrains.length > 0) {
    newAllTrains = allTrains.map((train) => {
      let item = {
        key: train.trainNumber,
        text: train.trainNumber,
        value: train.trainNumber,
      };

      if (allTrainInfoToday && !_.isEmpty(allTrainInfoToday)) {
        let info = allTrainInfoToday.find((trainInfo) => {
          return trainInfo.trainNumber === train.trainNumber;
        });
        //Lisää tunnus (IC,T yms), jos sellainen löytyy
        if (info) {
          item.text = info.trainType + " " + train.trainNumber;
        }
      }
      return item;
    });
  }
  return newAllTrains;
};

