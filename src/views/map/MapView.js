import _ from "lodash";
import { Component } from "react";
import store from "./../../store/train";
import DigitrafficService from "../../services/DigitrafficService";
import MapComponent from "./../../components/map/MapComponent";
import UpdateTrainsForm from "./../../components/forms/UpdateTrainsForm";
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

  getAllDropDownTrains = () => {
    let allTrains = [];
    if (this.state.allTrains && this.state.allTrains.length > 0) {
      allTrains = this.state.allTrains.map((train) => {
        let item = {
          key: train.trainNumber,
          text: train.trainNumber,
          value: train.trainNumber,
        };

        if (this.state.allTrainInfoToday && !_.isEmpty(this.state.allTrainInfoToday)) {
          let info = this.state.allTrainInfoToday.find((trainInfo) => {
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
    return allTrains;
  };

  render() {
    let allTrains = this.getAllDropDownTrains();
    const { t } = this.props;
    return (
      <div>
        {/*<h2>PollingCount: {this.state.pollingCount}</h2>*/}
        <div>
          <UpdateTrainsForm
            name={t('update-train-list')}
            allTrains={allTrains}
          ></UpdateTrainsForm>
        </div>
        <MapComponent allTrains={this.state.allTrains} allTrainInfoToday={this.state.allTrainInfoToday}></MapComponent>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    pollingCount: state.pollingCount
  };
}

export default (connect(mapStateToProps), withTranslation())(MapView);
