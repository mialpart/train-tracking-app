import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
  useMap,
} from "react-leaflet";
import _ from "lodash";
import "./MapComponent.css";
import "leaflet/dist/leaflet.css";
import store from "./../../store/train";
import markerTrainIconPng from "./../../assets/images/train-tunnel-blue.svg"; //train marker
import DigitrafficService from "./../../services/DigitrafficService";
import {
  updatePollingCount,
  updateAllTrains,
  updateCurrentTrain,
} from "../../store/features/trainSlicer";
import { Component } from "react";
import { bindActionCreators } from "redux";
import { Icon } from "leaflet";
import { connect } from "react-redux";
import stations from "./../../assets/metadata/stations.json";
import moment from "moment";
import "moment/locale/fi"; // without this line it didn't work
moment.locale("fi");

//Karttatasot omaan funktioon
function MapLayersControl() {
  return (
    <LayersControl position="topright">
      <LayersControl.BaseLayer name="Mapnik">
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name="BlackAndWhite">
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
        />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name="Toner">
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="http://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}.png"
        />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name="Light all">
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
        />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer checked name="Dark all">
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
        />
      </LayersControl.BaseLayer>
      {/* Rautatie-taso kartalle */}
      <LayersControl.Overlay checked name="Raide-taso">
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png"
        />
      </LayersControl.Overlay>
    </LayersControl>
  );
}

//Päivitä kohdistus vain jos yksittäinen juna seurannassa
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, map.getZoom()); //käytä zoomia jos haluat vakioida zoomin
  return null;
}

function LatestStationsInfo(props) {
  let scheduleTime = props.hasLiveEstimate ? (
    <div>
      <b>Live - arvioitu saapumisaika:</b> {props.trainInfo.liveEstimateTime}
    </div>
  ) : (
    <div>
      <b>Aikataulu:</b> {props.trainInfo.scheduledTime}
    </div>
  );

  return (
    <div>
      <b>Edellinen asema:</b> {props.trainInfo.departure} <br />
      <b>Seuraava asema:</b> {props.trainInfo.arrival} <br />
      {scheduleTime}
      {/* Esimerkki if-lausekkeesta templatella 
      {props.hasLiveEstimate && <b>Live - arvioitu saapumisaika:</b>}{" "}
      {props.trainInfo.liveEstimateTime} */}
      <br />
    </div>
  );
}

function SingleTrainMarker(props) {
  let latestStationsInfos = <div></div>;
  let hasLiveEstimate = props.trainInfo.liveEstimateTime ? true : false;
  if (!props.allTrainsSelected) {
    latestStationsInfos = (
      <LatestStationsInfo
        trainInfo={props.trainInfo}
        hasLiveEstimate={hasLiveEstimate}
      ></LatestStationsInfo>
    );
  }

  return (
    <Marker
      position={props.coordinates}
      icon={
        new Icon({
          iconUrl: markerTrainIconPng,
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        })
      }
    >
      <Popup autoPan={false}>
        <h5>
          {_.toUpper(props.trainInfo.operatorShortCode)} -{" "}
          {props.trainInfo.trainType} {props.trainInfo.trainNumber}
        </h5>
        {/*TODO: Hae asematiedot meta-filestä // jostain keksittävä lähimmän ajan haku -> seuraavan aseman tiedot */}
        <b>Lähtöasema:</b> {props.trainInfo.firstDepartureStation} <br />
        <b>Pääteasema:</b> {props.trainInfo.lastArrivalStation} <br />
        <b>Aikataulu:</b> {props.trainInfo.lastArrivalStationTime} <br />
        <br />
        {latestStationsInfos}
        <b>Nopeus:</b> {props.trainInfo.speed} km/h
        <br />
        <b>Liikkeessä:</b> {props.trainInfo.runningCurrently} <br />
      </Popup>
    </Marker>
  );
}

class MapComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      delay: 5000,
      coordinates: [62.24147, 25.72088],
      allCoordinates: [],
      zoom: 13,
      speed: 0,
      trainInfo: [],
      allTrains: [],
      allTrainsSelected: false,
      trackTheTrain: false,
      currentTrain: {},
    };

    store.subscribe(() => {
      // When state will be updated(in our case, when items will be fetched),
      // we will update local component state and force component to rerender
      // with new data.

      this.setState({
        delay: store.getState().train.delay,
        allCoordinates: store.getState().train.allCoordinates,
        zoom: store.getState().train.zoom,
        trainInfo: store.getState().train.trainInfo,
        allTrains: store.getState().train.allTrains,
        allTrainsSelected: store.getState().train.allTrainsSelected,
        trackTheTrain: store.getState().train.trackTheTrain,
        currentTrain: store.getState().train.currentTrain,
        coordinates: this.hasCurrentTrain(store.getState().train.currentTrain)
          ? this.getCorrectCoordinates(
              store.getState().train.currentTrain.location.coordinates
            )
          : [62.24147, 25.72088],
      });
    });
  }

  componentDidMount() {
    this.interval = setInterval(this.tick, this.state.delay);
  }

  componentDidUpdate(prevProps, prevState) {
    this.doTrackTheTrain(prevState);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  changeCurrentZoom(value) {
    this.setState({
      zoom: value,
    });
  }

  getCorrectCoordinates(coordinates) {
    return [coordinates[1], coordinates[0]];
  }

  doTrackTheTrain(prevState) {
    if (this.state.trackTheTrain) {
      clearInterval(this.interval);
      this.interval = setInterval(this.tick, this.state.delay);
    } else if (!this.state.trackTheTrain) {
      clearInterval(this.interval);
    }
  }

  tick = () => {
    DigitrafficService.getLatestCoordinate(this.state.currentTrain.trainNumber)
      .then((data) => {
        if (data && data.length > 0) {
          let coordinate = this.getCorrectCoordinates(
            data[0].location.coordinates
          );
          this.setState({
            coordinates: coordinate,
            currentTrain: data[0],
          });
          //mapStateToProps ja mapDispatchToProps tarvitaan että data päivittyy kunnolla
          this.props.updatePollingCount();
          this.props.updateCurrentTrain(data[0]);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    DigitrafficService.getLatestCoordinateAll()
      .then((data) => {
        if (data && data.length > 0) {
          this.props.updateAllTrains(data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  getTrainInfo = (trainInfo, currentTrain) => {
    let info = {
      trainNumber: 0,
      operatorShortCode: "",
      trainType: "",
      runningCurrently: "",
      speed: 0,
      liveEstimateTime: "",
      scheduledTime: "",
      arrival: "",
      departure: "",
    };

    let firstStation = this.getFirstOrLastStation("DEPARTURE", trainInfo);
    let lastStation = this.getFirstOrLastStation("ARRIVAL", trainInfo);
    let nextArrivalInfo = this.getTimeTableInfo("ARRIVAL", trainInfo);
    let latestDepartureInfo = this.getTimeTableInfo("DEPARTURE", trainInfo);

    if (
      (this.hasSingleTrainSelected() || this.hasAllTrainsSelected()) &&
      trainInfo
    ) {
      info = {
        trainNumber: currentTrain.trainNumber,
        operatorShortCode: trainInfo.operatorShortCode,
        trainType: trainInfo.trainType,
        runningCurrently: trainInfo.runningCurrently ? "Kyllä" : "Ei",
        speed: currentTrain ? currentTrain.speed : 0,
        firstDepartureStation: firstStation
          ? this.getStationName(firstStation.stationShortCode)
          : null,
        lastArrivalStation: lastStation
          ? this.getStationName(lastStation.stationShortCode)
          : null,
        lastArrivalStationTime: lastStation
          ? moment(lastStation.scheduledTime).format("HH:mm:ss")
          : null,
        liveEstimateTime:
          nextArrivalInfo &&
          nextArrivalInfo.liveEstimateTime &&
          !this.state.allTrainsSelected
            ? moment(nextArrivalInfo.liveEstimateTime).format("HH:mm:ss")
            : null,
        scheduledTime:
          nextArrivalInfo && !this.state.allTrainsSelected
            ? moment(nextArrivalInfo.scheduledTime).format("HH:mm:ss")
            : null,
        departure:
          latestDepartureInfo && !this.state.allTrainsSelected
            ? this.getStationName(latestDepartureInfo.stationShortCode)
            : "",
        arrival:
          nextArrivalInfo && !this.state.allTrainsSelected
            ? this.getStationName(nextArrivalInfo.stationShortCode)
            : "",
      };
    }
    return info;
  };

  getStationName(stationShortCode) {
    return stations.find((station) => {
      return station.stationShortCode === stationShortCode;
    }).stationName;
  }

  //TODO siirrä näitä myöhemmin helper-luokkaan selkeyden vuoksi
  getFirstOrLastStation(type, trainInfo) {
    if (!trainInfo) {
      return null;
    }

    let filteredTimeTableInfos = trainInfo.timeTableRows
      .slice()
      .sort((rowItem) => {
        return rowItem.scheduledTime && moment(rowItem.scheduledTime).valueOf();
      });
    if (filteredTimeTableInfos) {
      if (type === "ARRIVAL") {
        return _.last(filteredTimeTableInfos);
      } else {
        return _.first(filteredTimeTableInfos);
      }
    } else {
      return null;
    }
  }

  getClosestDepartureTime(type, trainInfo) {
    let currentTime = new moment().valueOf();
    let filteredTimeTableInfo = trainInfo.timeTableRows
      .filter((row) => {
        let rowTime = new moment(row.scheduledTime).valueOf();
        return row.type === type && currentTime > rowTime;
      })
      //Jos haluaa ensimmäisen lähdön (lähtöpiste), käytä sortia
      .reverse((rowItem) => {
        return moment(rowItem.scheduledTime).valueOf();
      })
      .find((rowItem) => {
        return moment(rowItem.scheduledTime).isBefore(currentTime);
      });
    return filteredTimeTableInfo;
  }

  getClosestArrivalTime(type, trainInfo) {
    let currentTime = new moment().valueOf();
    let filteredTimeTableInfo = trainInfo.timeTableRows
      .filter((row) => {
        let rowTime = new moment(row.scheduledTime).valueOf();
        return row.type === type && currentTime < rowTime;
      })
      .sort((rowItem) => {
        return moment(rowItem.scheduledTime).valueOf();
      })
      .find((rowItem) => {
        return moment(rowItem.scheduledTime).isAfter(currentTime);
      });
    console.log(filteredTimeTableInfo);
    return filteredTimeTableInfo;
  }

  getTimeTableInfo(type, trainInfo) {
    if (!trainInfo || this.state.allTrainsSelected) {
      return null;
    } else {
      let closestTimeTableInfo =
        type === "ARRIVAL"
          ? this.getClosestArrivalTime(type, trainInfo)
          : this.getClosestDepartureTime(type, trainInfo);
      return closestTimeTableInfo;
    }
  }

  hasSingleTrainSelected() {
    return (
      !this.state.allTrainsSelected &&
      this.state.trainInfo &&
      this.state.trainInfo.length > 0
    );
  }

  hasAllTrainsSelected() {
    return (
      this.state.allTrainsSelected &&
      this.props.allTrainInfoToday &&
      this.props.allTrainInfoToday.length > 0
    );
  }

  hasCurrentTrain() {
    return !_.isEmpty(this.state.currentTrain);
  }

  render() {
    let trainInfo = {};
    let currentZoom = this.state.zoom;
    let showAllTrains = <div></div>;
    let changeView = <div></div>;

    //Kartan markkereiden asettaminen (kaikki junat vs yksittäinen)
    if (this.state.allTrains && this.state.allTrainsSelected) {
      showAllTrains = this.state.allTrains.map((item, index) => {
        let foundTrain = _.find(this.props.allTrainInfoToday, {
          trainNumber: item.trainNumber,
        });
        let coordinates = this.getCorrectCoordinates(item.location.coordinates);
        trainInfo = this.getTrainInfo(foundTrain, item);
        return (
          <SingleTrainMarker
            key={index}
            train={item.trainNumber}
            trainInfo={trainInfo}
            coordinates={coordinates}
            allTrainsSelected={this.state.allTrainsSelected}
          ></SingleTrainMarker>
        );
      });
    } else {
      trainInfo = this.getTrainInfo(
        this.state.trainInfo[0],
        this.state.currentTrain
      );
      let coordinates = this.state.coordinates;
      showAllTrains = (
        <SingleTrainMarker
          coordinates={coordinates}
          train={this.state.train}
          trainInfo={trainInfo}
          allTrainsSelected={this.state.allTrainsSelected}
        ></SingleTrainMarker>
      );
    }

    //Kohdista kartta jos vain yksitäinen juna näkyvissä
    if (!this.state.allTrainsSelected) {
      changeView = (
        <ChangeView
          center={this.state.coordinates}
          zoom={currentZoom}
        ></ChangeView>
      );
    }

    return (
      <div id="mapid">
        <MapContainer
          center={this.state.coordinates}
          zoom={this.state.zoom}
          scrollWheelZoom={true}
        >
          {/* A JSX comment 
          Tässä esimerkkinä miten voidaan käyttää myös mapconsumeria
          <MapConsumer>
            {(map) => {
              if(currentZoom !== map.getZoom()) {
                map.setView(map.getCenter(), map.getZoom());
              }
              return null
            }}
          </MapConsumer>
          */}
          {changeView}
          <MapLayersControl></MapLayersControl>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
          />

          {showAllTrains}
        </MapContainer>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      updatePollingCount: updatePollingCount,
      updateAllTrains: updateAllTrains,
      updateCurrentTrain: updateCurrentTrain,
    },
    dispatch
  );
}

function mapStateToProps(state) {
  return {
    pollingCount: state.pollingCount,
    trackTheTrain: state.trackTheTrain,
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(MapComponent);
