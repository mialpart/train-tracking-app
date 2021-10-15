import { configureStore } from '@reduxjs/toolkit';
import trainSlicer from './features/trainSlicer';

export default configureStore({
  reducer: {
      train: trainSlicer
  }
})