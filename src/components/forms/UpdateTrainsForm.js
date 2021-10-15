import './Form.css';
import store from "../../store/train";
import { Button, Dropdown } from "semantic-ui-react";
import { useDispatch } from "react-redux";
import DigitrafficService from "../../services/DigitrafficService";
import { updateAllTrains, updateTrain, updateTrainInfo } from "../../store/features/trainSlicer";

function UpdateTrainsForm(props) {
  //const trainId = useSelector((state) => state.train.train);
  function handleDropDownSelect (event, data) {
    getLatestCoordinatForTrain(data.value, dispatch);
    getLatestInfoForTrain(data.value, dispatch);
  };
  const dispatch = useDispatch();
  return (
    <div>
    <Dropdown className="dropdown-trains"
      onChange={handleDropDownSelect}
      placeholder="State"
      search
      selection
      options={props.allTrains}
    />
    <div className="btn-update">
      <Button
        aria-label={props.name}
        onClick={() => {
          storeAllTrains(dispatch);
        }}
      >
        {props.name}
      </Button>
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
        dispatch(
          updateTrain({ coordinates: coordinate, trainNumber: trainNumber })
        );
        if(store.getState().train.allTrains.length === 0) (
          storeAllTrains(dispatch)
        )
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
        dispatch(
          updateTrainInfo(data)
        );
        if(store.getState().train.allTrains.length === 0) (
          storeAllTrains(dispatch)
        )
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
          dispatch(
            updateAllTrains(data)
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
export default UpdateTrainsForm;
