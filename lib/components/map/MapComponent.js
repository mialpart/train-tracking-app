"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactLeaflet = require("react-leaflet");

var _lodash = _interopRequireDefault(require("lodash"));

require("./MapComponent.css");

require("leaflet/dist/leaflet.css");

var _train = _interopRequireDefault(require("./../../store/train"));

var _trainTunnelBlue = _interopRequireDefault(require("./../../assets/images/train-tunnel-blue.svg"));

var _DigitrafficService = _interopRequireDefault(require("./../../services/DigitrafficService"));

var _trainSlicer = require("../../store/features/trainSlicer");

var _react = require("react");

var _redux = require("redux");

var _leaflet2 = require("leaflet");

var _reactRedux = require("react-redux");

var _stations = _interopRequireDefault(require("./../../assets/metadata/stations.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//Karttatasot omaan funktioon
function MapLayersControl() {
  return /*#__PURE__*/React.createElement(_reactLeaflet.LayersControl, {
    position: "topright"
  }, /*#__PURE__*/React.createElement(_reactLeaflet.LayersControl.BaseLayer, {
    name: "Mapnik"
  }, /*#__PURE__*/React.createElement(_reactLeaflet.TileLayer, {
    attribution: "\xA9 <a href=\"http://osm.org/copyright\">OpenStreetMap</a> contributors",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  })), /*#__PURE__*/React.createElement(_reactLeaflet.LayersControl.BaseLayer, {
    name: "BlackAndWhite"
  }, /*#__PURE__*/React.createElement(_reactLeaflet.TileLayer, {
    attribution: "\xA9 <a href=\"http://osm.org/copyright\">OpenStreetMap</a> contributors",
    url: "https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
  })), /*#__PURE__*/React.createElement(_reactLeaflet.LayersControl.BaseLayer, {
    name: "Toner"
  }, /*#__PURE__*/React.createElement(_reactLeaflet.TileLayer, {
    attribution: "\xA9 <a href=\"http://osm.org/copyright\">OpenStreetMap</a> contributors",
    url: "http://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}.png"
  })), /*#__PURE__*/React.createElement(_reactLeaflet.LayersControl.BaseLayer, {
    name: "Light all"
  }, /*#__PURE__*/React.createElement(_reactLeaflet.TileLayer, {
    attribution: "\xA9 <a href=\"http://osm.org/copyright\">OpenStreetMap</a> contributors",
    url: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
  })), /*#__PURE__*/React.createElement(_reactLeaflet.LayersControl.BaseLayer, {
    checked: true,
    name: "Dark all"
  }, /*#__PURE__*/React.createElement(_reactLeaflet.TileLayer, {
    attribution: "\xA9 <a href=\"http://osm.org/copyright\">OpenStreetMap</a> contributors",
    url: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
  })), /*#__PURE__*/React.createElement(_reactLeaflet.LayersControl.Overlay, {
    checked: true,
    name: "Raide-taso"
  }, /*#__PURE__*/React.createElement(_reactLeaflet.TileLayer, {
    attribution: "\xA9 <a href=\"http://osm.org/copyright\">OpenStreetMap</a> contributors",
    url: "https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png"
  })));
} //Päivitä kohdistus vain jos yksittäinen juna seurannassa 


function ChangeView(_ref) {
  var center = _ref.center,
      zoom = _ref.zoom;
  var map = (0, _reactLeaflet.useMap)();
  map.setView(center, map.getZoom()); //käytä zoomia jos haluat vakioida zoomin

  return null;
}

function SingleTrainMarker(props) {
  return /*#__PURE__*/React.createElement(_reactLeaflet.Marker, {
    position: props.coordinates,
    icon: new _leaflet2.Icon({
      iconUrl: _trainTunnelBlue.default,
      iconSize: [25, 41],
      iconAnchor: [12, 41]
    })
  }, /*#__PURE__*/React.createElement(_reactLeaflet.Popup, {
    autoPan: false
  }, /*#__PURE__*/React.createElement("b", null, "Operaattori: "), " ", _lodash.default.toUpper(props.trainInfo.operatorShortCode), " ", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("b", null, "Juna: "), props.trainInfo.trainType, " ", props.trainInfo.trainNumber, " ", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("b", null, "Nopeus:"), " ", props.trainInfo.speed, " km/h", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("b", null, "Liikkeess\xE4:"), " ", props.trainInfo.runningCurrently, " ", /*#__PURE__*/React.createElement("br", null)));
}

var MapComponent = /*#__PURE__*/function (_Component) {
  _inherits(MapComponent, _Component);

  var _super = _createSuper(MapComponent);

  function MapComponent(props) {
    var _this;

    _classCallCheck(this, MapComponent);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "tick", function () {
      _DigitrafficService.default.getLatestCoordinate(_this.state.currentTrain.trainNumber).then(function (data) {
        if (data && data.length > 0) {
          var coordinate = _this.getCorrectCoordinates(data[0].location.coordinates);

          _this.setState({
            coordinates: coordinate,
            currentTrain: data[0]
          }); //mapStateToProps ja mapDispatchToProps tarvitaan että data päivittyy kunnolla


          _this.props.updatePollingCount();

          _this.props.updateCurrentTrain(data[0]);
        }
      }).catch(function (error) {
        console.log(error);
      });

      _DigitrafficService.default.getLatestCoordinateAll().then(function (data) {
        if (data && data.length > 0) {
          _this.props.updateAllTrains(data);
        }
      }).catch(function (error) {
        console.error(error);
      });
    });

    _defineProperty(_assertThisInitialized(_this), "getTrainInfo", function (trainInfo, currentTrain) {
      var info = {
        trainNumber: 0,
        operatorShortCode: "",
        trainType: "",
        runningCurrently: "",
        speed: 0,
        liveEstimateTime: "",
        scheduledTime: "",
        arrival: "",
        departure: ""
      };

      var nextArrivalInfo = _this.getTimeTableInfo("ARRIVAL", trainInfo);

      var nextDepartureInfo = _this.getTimeTableInfo("DEPARTURE", trainInfo);

      if ((_this.hasSingleTrainSelected() || _this.hasAllTrainsSelected()) && trainInfo) {
        info = {
          trainNumber: currentTrain.trainNumber,
          operatorShortCode: trainInfo.operatorShortCode,
          trainType: trainInfo.trainType,
          runningCurrently: trainInfo.runningCurrently ? "Kyllä" : "Ei",
          speed: currentTrain ? currentTrain.speed : 0,
          liveEstimateTime: "",
          scheduledTime: "",
          departure: nextDepartureInfo ? _this.getStationName(nextDepartureInfo.stationShortCode) : "",
          arrival: nextArrivalInfo ? _this.getStationName(nextArrivalInfo.stationShortCode) : ""
        };
      }

      return info;
    });

    _this.state = {
      delay: 5000,
      coordinates: [62.24147, 25.72088],
      allCoordinates: [],
      zoom: 13,
      speed: 0,
      trainInfo: [],
      allTrains: [],
      allTrainsSelected: false,
      trackTheTrain: false,
      currentTrain: {}
    };

    _train.default.subscribe(function () {
      // When state will be updated(in our case, when items will be fetched),
      // we will update local component state and force component to rerender
      // with new data.
      _this.setState({
        delay: _train.default.getState().train.delay,
        allCoordinates: _train.default.getState().train.allCoordinates,
        zoom: _train.default.getState().train.zoom,
        trainInfo: _train.default.getState().train.trainInfo,
        allTrains: _train.default.getState().train.allTrains,
        allTrainsSelected: _train.default.getState().train.allTrainsSelected,
        trackTheTrain: _train.default.getState().train.trackTheTrain,
        currentTrain: _train.default.getState().train.currentTrain,
        coordinates: _this.hasCurrentTrain(_train.default.getState().train.currentTrain) ? _this.getCorrectCoordinates(_train.default.getState().train.currentTrain.location.coordinates) : [62.24147, 25.72088]
      });
    });

    return _this;
  }

  _createClass(MapComponent, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.interval = setInterval(this.tick, this.state.delay);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      this.doTrackTheTrain(prevState);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      clearInterval(this.interval);
    }
  }, {
    key: "changeCurrentZoom",
    value: function changeCurrentZoom(value) {
      this.setState({
        zoom: value
      });
    }
  }, {
    key: "getCorrectCoordinates",
    value: function getCorrectCoordinates(coordinates) {
      return [coordinates[1], coordinates[0]];
    }
  }, {
    key: "doTrackTheTrain",
    value: function doTrackTheTrain(prevState) {
      if (this.state.trackTheTrain) {
        clearInterval(this.interval);
        this.interval = setInterval(this.tick, this.state.delay);
      } else if (!this.state.trackTheTrain) {
        clearInterval(this.interval);
      }
    }
  }, {
    key: "getStationName",
    value: function getStationName(stationShortCode) {
      return _stations.default.find(function (station) {
        return station.stationShortCode === stationShortCode;
      }).stationName;
    }
  }, {
    key: "getTimeTableInfo",
    value: function getTimeTableInfo(type, trainInfo) {
      if (trainInfo) {
        var filteredTimeTableInfo = trainInfo.timeTableRows.filter(function (row) {
          return row.type === type;
        });
        return _lodash.default.last(filteredTimeTableInfo);
      } else {
        return null;
      }
    }
  }, {
    key: "hasSingleTrainSelected",
    value: function hasSingleTrainSelected() {
      return !this.state.allTrainsSelected && this.state.trainInfo && this.state.trainInfo.length > 0;
    }
  }, {
    key: "hasAllTrainsSelected",
    value: function hasAllTrainsSelected() {
      return this.state.allTrainsSelected && this.props.allTrainInfoToday && this.props.allTrainInfoToday.length > 0;
    }
  }, {
    key: "hasCurrentTrain",
    value: function hasCurrentTrain() {
      return !_lodash.default.isEmpty(this.state.currentTrain);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var trainInfo = {};
      var currentZoom = this.state.zoom;
      var showAllTrains = /*#__PURE__*/React.createElement("div", null);
      var changeView = /*#__PURE__*/React.createElement("div", null); //Kartan markkereiden asettaminen (kaikki junat vs yksittäinen)

      if (this.state.allTrains && this.state.allTrainsSelected) {
        showAllTrains = this.state.allTrains.map(function (item, index) {
          var foundTrain = _lodash.default.find(_this2.props.allTrainInfoToday, {
            trainNumber: item.trainNumber
          });

          var coordinates = _this2.getCorrectCoordinates(item.location.coordinates);

          trainInfo = _this2.getTrainInfo(foundTrain, item);
          return /*#__PURE__*/React.createElement(SingleTrainMarker, {
            key: index,
            train: item.trainNumber,
            trainInfo: trainInfo,
            coordinates: coordinates
          });
        });
      } else {
        trainInfo = this.getTrainInfo(this.state.trainInfo[0], this.state.currentTrain);
        var coordinates = this.state.coordinates;
        showAllTrains = /*#__PURE__*/React.createElement(SingleTrainMarker, {
          coordinates: coordinates,
          train: this.state.train,
          trainInfo: trainInfo
        });
      } //Kohdista kartta jos vain yksitäinen juna näkyvissä


      if (!this.state.allTrainsSelected) {
        changeView = /*#__PURE__*/React.createElement(ChangeView, {
          center: this.state.coordinates,
          zoom: currentZoom
        });
      }

      return /*#__PURE__*/React.createElement("div", {
        id: "mapid"
      }, /*#__PURE__*/React.createElement(_reactLeaflet.MapContainer, {
        center: this.state.coordinates,
        zoom: this.state.zoom,
        scrollWheelZoom: true
      }, changeView, /*#__PURE__*/React.createElement(MapLayersControl, null), /*#__PURE__*/React.createElement(_reactLeaflet.TileLayer, {
        attribution: "\xA9 <a href=\"http://osm.org/copyright\">OpenStreetMap</a> contributors",
        url: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
      }), showAllTrains));
    }
  }]);

  return MapComponent;
}(_react.Component);

function mapDispatchToProps(dispatch) {
  return (0, _redux.bindActionCreators)({
    updatePollingCount: _trainSlicer.updatePollingCount,
    updateAllTrains: _trainSlicer.updateAllTrains,
    updateCurrentTrain: _trainSlicer.updateCurrentTrain
  }, dispatch);
}

function mapStateToProps(state) {
  return {
    pollingCount: state.pollingCount,
    trackTheTrain: state.trackTheTrain
  };
}

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(MapComponent);

exports.default = _default;