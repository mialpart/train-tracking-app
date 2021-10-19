"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//TODO:
//Tänne voisi tehdä haun asemille: https://rata.digitraffic.fi/api/v1/metadata/stations
//Train trackingilla edellinen ja seuraava asema:
//Kaikki junat: https://rata.digitraffic.fi/api/v1/train-tracking?version=65403053026
//Yksi juna: https://rata.digitraffic.fi/api/v1/train-tracking/2021-10-19/73?version=1000
//Timetablet löytyy täältä: https://rata.digitraffic.fi/api/v1/trains/latest/10457
var DigitrafficService = {
  getLatestCoordinate: function getLatestCoordinate(value) {
    var url = "https://rata.digitraffic.fi/api/v1/train-locations/latest/" + value;
    return _axios.default.get(url).then(function (data) {
      return data.data;
    }).catch(function (error) {
      console.error(error);
    });
  },
  getLatestCoordinateAll: function getLatestCoordinateAll() {
    var url = "https://rata.digitraffic.fi/api/v1/train-locations/latest/";
    return _axios.default.get(url).then(function (data) {
      return data.data;
    }).catch(function (error) {
      console.error(error);
    });
  },
  getLatestTrainInfo: function getLatestTrainInfo(value) {
    var url = "https://rata.digitraffic.fi/api/v1/trains/latest/" + value;
    return _axios.default.get(url).then(function (data) {
      return data.data;
    }).catch(function (error) {
      console.error(error);
    });
  },
  getAllTrainInfoToday: function getAllTrainInfoToday() {
    var date = (0, _moment.default)().format('YYYY-MM-DD');
    var url = "https://rata.digitraffic.fi/api/v1/trains/" + date;
    return _axios.default.get(url).then(function (data) {
      return data.data;
    }).catch(function (error) {
      console.error(error);
    });
  }
};
var _default = DigitrafficService;
exports.default = _default;