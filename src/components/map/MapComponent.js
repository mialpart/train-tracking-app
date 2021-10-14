import { MapContainer, TileLayer, Marker, Popup, LayersControl, useMap, MapConsumer } from "react-leaflet";
import { Component } from "react";
//import markerIconPng from "leaflet/dist/images/marker-icon.png" //basic-marker
import markerTrainIconPng from "./../../assets/images/train-tunnel.svg"; //train marker
import { Icon } from "leaflet";
import "./MapComponent.css";
import "leaflet/dist/leaflet.css";
import DigitrafficService from './../../services/DigitrafficService';
const position = [62.24147, 25.72088];


//Karttatasot omaan funktioon
function MapLayersControl() {
    return (
    <LayersControl position="topright">
      <LayersControl.BaseLayer checked name="Mapnik">
        <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name="BlackAndWhite">
        <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png" />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name="Toner">
        <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="http://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}.png" />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name="Light all">
        <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png" />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name="Dark all">
        <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png" />
      </LayersControl.BaseLayer>
      //Rautatie-taso kartalle
      <LayersControl.Overlay checked name="Raide-taso">
        <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png" />
      </LayersControl.Overlay>
    </LayersControl>);
}

function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, map.getZoom()); //käytä zoomia jos haluat vakioida zoomin
  return null;
}

class MapComponent extends Component { 
  state = {
    pollingCount: 0,
    delay: 4000,
    coordinates: [62.24147, 25.72088],
    zoom: 13
  }
  componentDidMount() {
    this.interval = setInterval(this.tick, this.state.delay)
  }
  componentDidUpdate(prevProps, prevState) {
    if(prevState.delay !== this.state.delay) {
      clearInterval(this.interval);
      this.interval = setInterval(this.tick, this.steta.delay);
    } 
  } 
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  changeCurrentZoom(value) {
    this.setState({
      zoom: value
    })
  }

  tick = () => {
    //TODO tee dropdown josta voi hakea junan id:n
    DigitrafficService.getLatestCoordinate(73).then(data => {
      let coordinate = [data[0].location.coordinates[1], data[0].location.coordinates[0]]
      this.setState({
        pollingCount: this.state.pollingCount + 1,
        coordinates: coordinate,
      }); 
    }).catch(error => {
      console.log(error);
    })
  }

  render() {
    let currentZoom = this.state.zoom;
    return (
      <div id="mapid">
      <h2>PollingCount: {this.state.pollingCount}</h2>
      <MapContainer center={this.state.coordinates} zoom={this.state.zoom} scrollWheelZoom={true}>
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
      <ChangeView center={this.state.coordinates} zoom={currentZoom} >
      </ChangeView>
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
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
    )
    
  }
}

export default MapComponent;
