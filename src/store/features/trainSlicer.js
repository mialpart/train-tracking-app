import { createSlice } from "@reduxjs/toolkit";

//TODO muokkaa järkevämmäksi
export const trainSlice = createSlice({
  name: "train",
  initialState: {
    train: 0,
    pollingCount: 0,
    delay: 4000,
    coordinates: [62.24147, 25.72088],
    allCoordinates: [],
    allTrains: [],
    zoom: 13,
    trainInfo: [],
    allTrainInfoToday: [],
  },
  reducers: {
    updateTrain: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.train = action.payload.trainNumber;
      state.coordinates = action.payload.coordinates;
    },
    //Kaikkien junien koordinaatit
    updateAllTrains: (state, action) => {
      state.allTrains = action.payload;
      console.log("Juna-listaus päivitetty");
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
  updateTrain,
  updateAllTrains,
  updatePollingCount,
  updateTrainInfo,
  updateAllTrainInfoToday,
  updateAllTrainCoordinates
} = trainSlice.actions;

export default trainSlice.reducer;
