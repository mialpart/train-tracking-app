import { createSlice } from '@reduxjs/toolkit'

//TODO muokkaa järkevämmäksi
export const trainSlice = createSlice({
  name: 'train',
  initialState: {
    train: 0,
    pollingCount: 0,
    delay: 4000,
    coordinates: [62.24147, 25.72088],
    allCoordinates: [],
    zoom: 13,
  },
  reducers: {
    updateTrain:(state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.train = action.payload.trainNumber
      state.coordinates = action.payload.coordinates
    }
  }
})

// Action creators are generated for each case reducer function
export const { updateTrain } = trainSlice.actions

export default trainSlice.reducer