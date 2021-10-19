"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateTrainInfo = exports.updatePollingCount = exports.updateCurrentTrain = exports.updateAllTrains = exports.updateAllTrainInfoToday = exports.updateAllTrainCoordinates = exports.trainSlice = exports.trackTheTrain = exports.isAllTrainsSelected = exports.default = void 0;

var _toolkit = require("@reduxjs/toolkit");

//TODO muokkaa järkevämmäksi
var trainSlice = (0, _toolkit.createSlice)({
  name: "train",
  initialState: {
    pollingCount: 0,
    delay: 5000,
    allCoordinates: [],
    allTrains: [],
    zoom: 13,
    trainInfo: [],
    allTrainInfoToday: [],
    allTrainsSelected: false,
    trackTheTrain: false,
    currentTrain: {}
  },
  reducers: {
    //Trainnumber
    updateCurrentTrain: function updateCurrentTrain(state, action) {
      console.log("Juna päivittyy");
      console.log(action.payload);
      state.currentTrain = action.payload;
    },
    //Kaikkien junien koordinaatit
    updateAllTrains: function updateAllTrains(state, action) {
      state.allTrains = action.payload;
      console.log("Juna-listaus päivitetty");
    },
    trackTheTrain: function trackTheTrain(state, action) {
      state.trackTheTrain = action.payload;
    },
    isAllTrainsSelected: function isAllTrainsSelected(state, action) {
      state.allTrainsSelected = action.payload;
    },
    updateAllTrainCoordinates: function updateAllTrainCoordinates(state, action) {
      state.allCoordinates = action.payload;
    },
    //Kaikkien junien tiedot tältä päivältä
    updateAllTrainInfoToday: function updateAllTrainInfoToday(state, action) {
      state.allTrainInfoToday = action.payload;
      console.log("Päivän Juna-listaus päivitetty");
    },
    updatePollingCount: function updatePollingCount(state) {
      state.pollingCount += 1;
    },
    updateTrainInfo: function updateTrainInfo(state, action) {
      state.trainInfo = action.payload;
    }
  }
}); // Action creators are generated for each case reducer function

exports.trainSlice = trainSlice;
var _trainSlice$actions = trainSlice.actions,
    updateAllTrains = _trainSlice$actions.updateAllTrains,
    updatePollingCount = _trainSlice$actions.updatePollingCount,
    updateTrainInfo = _trainSlice$actions.updateTrainInfo,
    updateAllTrainInfoToday = _trainSlice$actions.updateAllTrainInfoToday,
    updateAllTrainCoordinates = _trainSlice$actions.updateAllTrainCoordinates,
    isAllTrainsSelected = _trainSlice$actions.isAllTrainsSelected,
    trackTheTrain = _trainSlice$actions.trackTheTrain,
    updateCurrentTrain = _trainSlice$actions.updateCurrentTrain;
exports.updateCurrentTrain = updateCurrentTrain;
exports.trackTheTrain = trackTheTrain;
exports.isAllTrainsSelected = isAllTrainsSelected;
exports.updateAllTrainCoordinates = updateAllTrainCoordinates;
exports.updateAllTrainInfoToday = updateAllTrainInfoToday;
exports.updateTrainInfo = updateTrainInfo;
exports.updatePollingCount = updatePollingCount;
exports.updateAllTrains = updateAllTrains;
var _default = trainSlice.reducer;
exports.default = _default;