import { createSlice } from "@reduxjs/toolkit";

//TODO muokkaa järkevämmäksi
export const trainSlice = createSlice({
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
    updateCurrentTrain: (state, action) => {
      console.log("Juna päivittyy");
      console.log(action.payload);
      state.currentTrain = action.payload;
    },
    //Kaikkien junien koordinaatit
    updateAllTrains: (state, action) => {
      state.allTrains = action.payload;
      console.log("Juna-listaus päivitetty");
    },
    trackTheTrain: (state, action) => {
      state.trackTheTrain = action.payload;
    },
    isAllTrainsSelected: (state, action) => {
      state.allTrainsSelected = action.payload;
    },
    updateAllTrainCoordinates: (state, action) => {
      state.allCoordinates = action.payload; 
    },
    //Kaikkien junien tiedot tältä päivältä
    updateAllTrainInfoToday: (state, action) => {
      state.allTrainInfoToday = action.payload;
      console.log("Päivän Juna-listaus päivitetty");
    },
    updatePollingCount: (state) => {
      state.pollingCount += 1;
    },
    updateTrainInfo: (state, action) => {
      state.trainInfo = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  updateAllTrains,
  updatePollingCount,
  updateTrainInfo,
  updateAllTrainInfoToday,
  updateAllTrainCoordinates,
  isAllTrainsSelected,
  trackTheTrain,
  updateCurrentTrain
} = trainSlice.actions;

export default trainSlice.reducer;
