import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
  useMap,
  MapConsumer,
} from "react-leaflet";
import { Component } from "react";
import store from "./../../store/train";
import markerTrainIconPng from "./../../assets/images/train-tunnel-blue.svg"; //train marker
import { Icon } from "leaflet";
import "./MapComponent.css";
import "leaflet/dist/leaflet.css";
import DigitrafficService from "./../../services/DigitrafficService";
import { useSelector, useDispatch } from "react-redux";
import { updateTrain } from "./../../store/features/trainSlicer";

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
      //Rautatie-taso kartalle
      <LayersControl.Overlay checked name="Raide-taso">
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png"
        />
      </LayersControl.Overlay>
    </LayersControl>
  );
}

function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, map.getZoom()); //käytä zoomia jos haluat vakioida zoomin
  return null;
}

function ChangeTrainButton(props) {
  //const trainId = useSelector((state) => state.train.train);
  const dispatch = useDispatch();
  return (
    <button
      aria-label={props.name}
      onClick={() => {
        getLatestCoordinatForTrain(props.trainNumber, dispatch);
      }}
    >
      {props.name}
    </button>
  );
}

//functio jossa asetetaan dispatchilla trainId etc
function getLatestCoordinatForTrain(trainNumber, dispatch) {
  DigitrafficService.getLatestCoordinate(trainNumber)
    .then((data) => {
      if(data && data.length > 0) {
        let coordinate = [
          data[0].location.coordinates[1],
          data[0].location.coordinates[0],
        ];
        dispatch(
          updateTrain({ coordinates: coordinate, trainNumber: trainNumber })
        );
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

class MapComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      train: 0,
      pollingCount: 0,
      delay: 4000,
      coordinates: [62.24147, 25.72088],
      allCoordinates: [],
      zoom: 13,
    };

    store.subscribe(() => {
      // When state will be updated(in our case, when items will be fetched),
      // we will update local component state and force component to rerender
      // with new data.
      this.setState({
        train: store.getState().train.train,
        pollingCount: store.getState().train.pollingCount,
        delay: store.getState().train.delay,
        coordinates: store.getState().train.coordinates,
        allCoordinates: store.getState().train.allCoordinates,
        zoom: store.getState().train.zoom,
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

  //TODO tee dropdown josta voi hakea junan id:n
  //Buttonit pois ja droppis tilalle siis
  tick = () => {
    DigitrafficService.getLatestCoordinate(this.state.train)
      .then((data) => {
        if(data && data.length > 0) {
          let coordinate = [
            data[0].location.coordinates[1],
            data[0].location.coordinates[0],
          ];
          this.setState({
            pollingCount: this.state.pollingCount + 1,
            coordinates: coordinate,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //TODO tee dropdown josta voi hakea junan id:n
  render() {
    let currentZoom = this.state.zoom;
    return (
      <div id="mapid">
        <h2>PollingCount: {this.state.pollingCount}</h2>
        <div>
          <ChangeTrainButton
            trainNumber={8}
            name={"Juna 1"}
          ></ChangeTrainButton>
          <ChangeTrainButton
            trainNumber={3}
            name={"Juna 2"}
          ></ChangeTrainButton>
          <span>{this.state.train}</span>
        </div>
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
          <ChangeView
            center={this.state.coordinates}
            zoom={currentZoom}
          ></ChangeView>
          <MapLayersControl></MapLayersControl>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
          />
          <Marker
            position={this.state.coordinates}
            icon={
              new Icon({
                iconUrl: markerTrainIconPng,
                iconSize: [25, 41],
                iconAnchor: [12, 41],
              })
            }
          >
            <Popup autoPan={false}>
              TODO: <br /> Juna numero {this.state.train}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    );
  }
}

export default MapComponent;
