import { Component } from "react";
import store from "./../../store/train";
import DigitrafficService from "../../services/DigitrafficService";
import MapComponent from "./../../components/map/MapComponent";
import UpdateTrainsForm from "./../../components/forms/UpdateTrainsForm";
import { getAllDropDownTrains } from "../../utils/functions/Trains";
import "./MapView.css";
import "leaflet/dist/leaflet.css";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";


class MapView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allTrains: [],
      pollingCount: 0,
      currentTrain: null
    };

    store.subscribe(() => {
      // When state will be updated(in our case, when items will be fetched),
      // we will update local component state and force component to rerender
      // with new data.
      this.setState({
        allTrains: store.getState().train.allTrains,
        pollingCount: store.getState().train.pollingCount,
        currentTrain: store.getState().train.currentTrain,
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

    //Ei tehdä tällä reduxiin tallennusta. Antaa herjaa:
    //SerializableStateInvariantMiddleware took 509ms, which is more than the warning threshold of 32ms.
    DigitrafficService.getAllTrainInfoToday()
      .then((data) => {
        if (data && data.length > 0) {
          this.setState({
            allTrainInfoToday: data,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    let allTrains = getAllDropDownTrains(this.state.allTrains, this.state.allTrainInfoToday);
    const { t } = this.props;
    return (
      <div>
        {/*<h2>PollingCount: {this.state.pollingCount}</h2>*/}
        <div>
          <UpdateTrainsForm
            name={t('update-train-list')}
            allTrains={allTrains}
            currentTrain={this.state.currentTrain}
          ></UpdateTrainsForm>
        </div>
        <MapComponent allTrains={this.state.allTrains} allTrainInfoToday={this.state.allTrainInfoToday}></MapComponent>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    pollingCount: state.pollingCount,
    currentTrain: state.currentTrain
  };
}

export default (connect(mapStateToProps), withTranslation())(MapView);
