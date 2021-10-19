"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("./Form.css");

var _train = _interopRequireDefault(require("../../store/train"));

var _lodash = _interopRequireDefault(require("lodash"));

var _semanticUiReact = require("semantic-ui-react");

var _reactRedux = require("react-redux");

var _DigitrafficService = _interopRequireDefault(require("../../services/DigitrafficService"));

var _redux = require("redux");

var _trainSlicer = require("../../store/features/trainSlicer");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function TrainSlider() {
  var dispatch = (0, _reactRedux.useDispatch)();

  function handleCheckBoxSelect(event, data) {
    dispatch((0, _trainSlicer.isAllTrainsSelected)(event.target.checked));
    storeAllTrains(dispatch);
    console.log(event.target.checked);
  }

  return /*#__PURE__*/React.createElement("div", {
    className: "ui slider checkbox"
  }, /*#__PURE__*/React.createElement("input", {
    onChange: handleCheckBoxSelect,
    type: "checkbox",
    name: "newsletter"
  }), /*#__PURE__*/React.createElement("label", null, "N\xE4yt\xE4 kaikki junat kartalla"));
}

function TrackTrainSlider() {
  var dispatch = (0, _reactRedux.useDispatch)();

  function handleCheckBoxSelect(event, data) {
    dispatch((0, _trainSlicer.trackTheTrain)(event.target.checked));
    console.log(event.target.checked);
  }

  return /*#__PURE__*/React.createElement("div", {
    className: "ui slider checkbox"
  }, /*#__PURE__*/React.createElement("input", {
    onChange: handleCheckBoxSelect,
    type: "checkbox",
    name: "newsletter"
  }), /*#__PURE__*/React.createElement("label", null, "Seuraa junaa"));
}

function UpdateTrainsForm(props) {
  var dispatch = (0, _reactRedux.useDispatch)();

  function handleDropDownSelect(event, data) {
    getLatestCoordinatForTrain(data.value, dispatch);
    getLatestInfoForTrain(data.value, dispatch);
  }

  var uniqTrains = _lodash.default.uniqBy(props.allTrains, 'key');

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(_semanticUiReact.Dropdown, {
    className: "dropdown-trains",
    onChange: handleDropDownSelect,
    placeholder: "Valitse juna",
    search: true,
    selection: true,
    options: uniqTrains
  }), /*#__PURE__*/React.createElement(TrainSlider, null), /*#__PURE__*/React.createElement(TrackTrainSlider, null)), /*#__PURE__*/React.createElement("div", {
    className: "btn-update"
  }, /*#__PURE__*/React.createElement(_semanticUiReact.Button, {
    "aria-label": props.name,
    onClick: function onClick() {
      storeAllTrains(dispatch);
    }
  }, props.name)));
} //functio jossa asetetaan dispatchilla trainId etc


function getLatestCoordinatForTrain(trainNumber, dispatch) {
  _DigitrafficService.default.getLatestCoordinate(trainNumber).then(function (data) {
    if (data && data.length > 0) {
      var coordinate = [data[0].location.coordinates[1], data[0].location.coordinates[0]];
      dispatch((0, _trainSlicer.updateCurrentTrain)(data[0]));

      if (_train.default.getState().train.allTrains.length === 0) {
        storeAllTrains(dispatch);
      }
    }
  }).catch(function (error) {
    console.log(error);
  });
} //functio jossa asetetaan dispatchilla trainId etc


function getLatestInfoForTrain(trainNumber, dispatch) {
  _DigitrafficService.default.getLatestTrainInfo(trainNumber).then(function (data) {
    if (data && data.length > 0) {
      dispatch((0, _trainSlicer.updateTrainInfo)(data));
      if (_train.default.getState().train.allTrains.length === 0) storeAllTrains(dispatch);
    }
  }).catch(function (error) {
    console.log(error);
  });
} //functio jossa asetetaan dispatchilla trainId etc


function storeAllTrains(dispatch) {
  _DigitrafficService.default.getLatestCoordinateAll().then(function (data) {
    if (data && data.length > 0) {
      dispatch((0, _trainSlicer.updateAllTrains)(data));
    }
  }).catch(function (error) {
    console.log(error);
  });
}

function mapDispatchToProps(dispatch) {
  return (0, _redux.bindActionCreators)({}, dispatch);
}

function mapStateToProps(state) {
  return {
    trackTheTrain: state.trackTheTrain
  };
}

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(UpdateTrainsForm);

exports.default = _default;