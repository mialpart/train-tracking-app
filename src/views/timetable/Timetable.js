
import logo from './../../assets/images/logo.svg';
import TrainDropDown from '../../components/forms/TrainDropDown';
import './Timetable.css';

import _ from "lodash";
import { Component } from "react";
import store from "./../../store/train";
import DigitrafficService from "../../services/DigitrafficService";
import {getAllDropDownTrains} from "../../utils/functions/Trains";
import "./Timetable.css";
import "leaflet/dist/leaflet.css";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import moment from 'moment';


class Timetable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allTrains: [],
      pollingCount: 0,
      currentTrain: {},
      trainInfo: {}
    };

    store.subscribe(() => {
      // When state will be updated(in our case, when items will be fetched),
      // we will update local component state and force component to rerender
      // with new data.
      this.setState({
        allTrains: store.getState().train.allTrains,
        pollingCount: store.getState().train.pollingCount,
        currentTrain: store.getState().train.currentTrain,
        trainInfo: store.getState().train.trainInfo
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
    let currentTrain = !_.isEmpty(this.state.currentTrain) ? this.state.currentTrain : null;
    let allTrains = getAllDropDownTrains(this.state.allTrains, this.state.allTrainInfoToday);
    const { t } = this.props;
    console.log(this.state.trainInfo[0])
    let timeTableList = <div></div>;
    if(this.state.trainInfo[0]) {
      let listElement = this.state.trainInfo[0].timeTableRows.map((timeTableRow, index) => {
          if(timeTableRow.actualTime && timeTableRow.stationShortCode) {
            return <li>
              actualTime: {moment(timeTableRow.actualTime).format("HH:mm:ss")},
              stationShortCode: {timeTableRow.stationShortCode},
              type: {timeTableRow.type}
            </li>;
          }
      })
      timeTableList = <ul>{listElement}</ul>;
    }
    return (
      <div>
        {/*<h2>PollingCount: {this.state.pollingCount}</h2>*/}
        <div>
          <TrainDropDown
            allTrains={allTrains}
            currentTrain={currentTrain}
          ></TrainDropDown>
          {timeTableList}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    pollingCount: state.pollingCount,
    currentTrain: state.currentTrain,
    trainInfo: state.trainInfo
  };
}

export default (connect(mapStateToProps), withTranslation())(Timetable);
