import DigitrafficService from "../../services/DigitrafficService";
import { updateAllTrains } from "../../store/features/trainSlicer";
import stations from './../../assets/metadata/stations.json'
import _ from "lodash";
import moment from "moment";

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

export const getStationName = (stationShortCode) => {
  return stations.find((station) => {
    return station.stationShortCode === stationShortCode;
  }).stationName;
}

export const getTypeName = (type) => {
  return type === "ARRIVAL" ? "Saapuva" : "Lähtevä"; 
}

export const getFirstOrLastStation = (type, trainInfo) => {
    if (!trainInfo) {
      return null;
    }

    let filteredTimeTableInfos = trainInfo.timeTableRows
      .slice()
      .sort((rowItem) => {
        return rowItem.scheduledTime && moment(rowItem.scheduledTime).valueOf();
      });
    if (filteredTimeTableInfos) {
      if (type === "ARRIVAL") {
        return _.last(filteredTimeTableInfos);
      } else {
        return _.first(filteredTimeTableInfos);
      }
    } else {
      return null;
    }
  }

export const getClosestDepartureTime = (type, trainInfo) => {
    let currentTime = new moment().valueOf();
    let filteredTimeTableInfo = trainInfo.timeTableRows
      .filter((row) => {
        let rowTime = new moment(row.scheduledTime).valueOf();
        return row.type === type && currentTime > rowTime;
      })
      //Jos haluaa ensimmäisen lähdön (lähtöpiste), käytä sortia
      .reverse((rowItem) => {
        return moment(rowItem.scheduledTime).valueOf();
      })
      .find((rowItem) => {
        return moment(rowItem.scheduledTime).isBefore(currentTime);
      });
    return filteredTimeTableInfo;
  }

export const getClosestArrivalTime = (type, trainInfo) => {
    let currentTime = new moment().valueOf();
    let filteredTimeTableInfo = trainInfo.timeTableRows
      .filter((row) => {
        let rowTime = new moment(row.scheduledTime).valueOf();
        return row.type === type && currentTime < rowTime;
      })
      .sort((rowItem) => {
        return moment(rowItem.scheduledTime).valueOf();
      })
      .find((rowItem) => {
        return moment(rowItem.scheduledTime).isAfter(currentTime);
      });
    return filteredTimeTableInfo;
  }

export const getTimeTableInfo = (type, trainInfo, allTrainsSelected) => {
    if (!trainInfo || allTrainsSelected) {
      return null;
    } else {
      let closestTimeTableInfo =
        type === "ARRIVAL"
          ? getClosestArrivalTime(type, trainInfo)
          : getClosestDepartureTime(type, trainInfo);
      return closestTimeTableInfo;
    }
  }

