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
  updateTrain,
  updateAllTrains,
} from "../../store/features/trainSlicer";
import { Component } from "react";
import { bindActionCreators } from "redux";
import { Icon } from "leaflet";
import { connect } from "react-redux";

/*
const baseLayers = [
  {
    name: "Mapnik",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    default: false,
  },
  {
    name: "BlackAndWhite",
    url: "https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png",
    default: false,
  },
  {
    name: "Toner",
    url: "http://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}.png",
    default: false,
  },
  {
    name: "Light all",
    url: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",
    default: false,
  },
  {
    name: "Dark all",
    url: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png",
    default: true,
  },
];

//TODO: Karttatasot omaan funktioon 
//(testi, checked tieto ei päivity oikein loopatessa)
function MapLayersControlTest() {
  const listItems = baseLayers.map((layer) => (
    <LayersControl.BaseLayer key={"base" + layer.name} name={layer.name}>
      <TileLayer
        key={layer.name}
        checked
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url={layer.url}
      />
    </LayersControl.BaseLayer>
  ));
  return (
    <LayersControl>
      {listItems}
      <LayersControl.Overlay checked name="Raide-taso">
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png"
        />
      </LayersControl.Overlay>
    </LayersControl>
  );
}
*/

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

function SingleTrainMarker(props) {
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
        Operaattori: {_.toUpper(props.trainInfo.operatorShortCode)} <br />
        Juna: {props.trainInfo.trainType} {props.train} <br />
        Nopeus: {props.currentSpeed} <br />
        Liikkeessä: {props.trainInfo.runningCurrently} <br />
      </Popup>
    </Marker>
  );
}


function MultipleTrainMarker(props) {
    return (<Marker position={[props.coordinates[1], props.coordinates[0]]} icon={new Icon({
              iconUrl: markerTrainIconPng,
              iconSize: [25, 41],
              iconAnchor: [12, 41]
            })}>
          <Popup key={props.index} autoPan={false}>
            Juna: {props.item.trainNumber} <br />
            Nopeus: {props.item.speed} <br />
          </Popup>
        </Marker>);
}


class MapComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      train: 0,
      delay: 4000,
      coordinates: [62.24147, 25.72088],
      allCoordinates: [],
      zoom: 13,
      speed: 0,
      trainInfo: [],
      allTrains: [],
      allTrainsSelected: false
    };

    store.subscribe(() => {
      // When state will be updated(in our case, when items will be fetched),
      // we will update local component state and force component to rerender
      // with new data.
      this.setState({
        train: store.getState().train.train,
        delay: store.getState().train.delay,
        coordinates: store.getState().train.coordinates,
        allCoordinates: store.getState().train.allCoordinates,
        zoom: store.getState().train.zoom,
        trainInfo: store.getState().train.trainInfo,
        allTrains: store.getState().train.allTrains,
        allTrainsSelected: store.getState().train.allTrainsSelected
      });
    });
  }

  componentDidMount() {
    this.interval = setInterval(this.tick, this.state.delay);
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.delay !== this.state.delay) {
      clearInterval(this.interval);
      this.interval = setInterval(this.tick, this.state.delay);
    }
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  changeCurrentZoom(value) {
    this.setState({
      zoom: value,
    });
  }

  tick = () => {
    DigitrafficService.getLatestCoordinate(this.state.train)
      .then((data) => {
        if (data && data.length > 0) {
          let coordinate = [
            data[0].location.coordinates[1],
            data[0].location.coordinates[0],
          ];
          this.setState({
            coordinates: coordinate,
            currentSpeed: data[0].speed,
          });
          //mapStateToProps ja mapDispatchToProps tarvitaan että data päivittyy kunnolla
          this.props.updatePollingCount();
          this.props.updateTrain({
            trainNumber: data[0].trainNumber,
            coordinates: coordinate,
          });
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

  getTrainInfo = () => {
    let info = {
      operatorShortCode: "",
      trainType: "",
      runningCurrently: "",
    };
    if (this.state.trainInfo && this.state.trainInfo.length > 0) {
      info = {
        operatorShortCode: this.state.trainInfo[0].operatorShortCode,
        trainType: this.state.trainInfo[0].trainType,
        runningCurrently: this.state.trainInfo[0].runningCurrently
          ? "Kyllä"
          : "Ei",
      };
    }
    return info;
  };

  render() {
    let currentZoom = this.state.zoom;
    let trainInfo = this.getTrainInfo();

    let showAllTrains = <div></div>;
    let changeView = <div></div> 

    //Kartan markkereiden asettaminen (kaikki junat vs yksittäinen)
    if (this.state.allTrains && this.state.allTrainsSelected) {
      showAllTrains = this.state.allTrains.map((item, index) => (
        <MultipleTrainMarker key={index} coordinates={item.location.coordinates} item={item} index={index}></MultipleTrainMarker>
      ));
    } else {
      showAllTrains = <SingleTrainMarker coordinates={this.state.coordinates} train={this.state.train} 
                      currentSpeed={this.state.currentSpeed} trainInfo={trainInfo}></SingleTrainMarker>
    }

    //Kohdista kartta jos vain yksitäinen juna näkyvissä
    if(!this.state.allTrainsSelected) {
      changeView = <ChangeView center={this.state.coordinates} zoom={currentZoom}></ChangeView>
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
      updateTrain: updateTrain,
      updateAllTrains: updateAllTrains,
    },
    dispatch
  );
}

function mapStateToProps(state) {
  return {
    pollingCount: state.pollingCount,
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(MapComponent);
