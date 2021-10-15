
import { Component } from "react";
import store from "./../../store/train";
import DigitrafficService from "../../services/DigitrafficService";
import MapComponent from './../../components/map/MapComponent';
import UpdateTrainsForm from './../../components/forms/UpdateTrainsForm';
import "./MapView.css";
import "leaflet/dist/leaflet.css";
//import DigitrafficService from "../../services/DigitrafficService";
import { connect } from "react-redux";
//import { updateTrain, updateAllTrains } from "../../store/features/trainSlicer";

//import { Button, Dropdown } from "semantic-ui-react";

class MapView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allTrains: [],
      pollingCount: 0,
    };

    store.subscribe(() => {
      // When state will be updated(in our case, when items will be fetched),
      // we will update local component state and force component to rerender
      // with new data.
      this.setState({
        allTrains: store.getState().train.allTrains,
        pollingCount: store.getState().train.pollingCount,
      });
    });
  }

  componentDidMount() {
    DigitrafficService.getLatestCoordinateAll()
      .then((data) => {
        if (data && data.length > 0) {
          this.setState({
            allTrains: data,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  render() {
    let allTrains = [];
    if (this.state.allTrains && this.state.allTrains.length > 0) {
      allTrains = this.state.allTrains.map((train) => {
        return {
          key: train.trainNumber,
          text: train.trainNumber,
          value: train.trainNumber,
        };
      });
    }
    return (
      <div>
      <h2>PollingCount: {this.state.pollingCount}</h2>
        <div>
          <UpdateTrainsForm
            name={"Päivitä junalistaus"}
            allTrains={allTrains}
          ></UpdateTrainsForm>
        </div>
      <MapComponent></MapComponent>
      </div>
    );
  }
}

function mapStateToProps(state){
  return{
    pollingCount: state.pollingCount
  };
}

export default connect(mapStateToProps)(MapView);
