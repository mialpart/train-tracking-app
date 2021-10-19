"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactRouterDom = require("react-router-dom");

var _Profile = _interopRequireDefault(require("./profile/Profile"));

var _About = _interopRequireDefault(require("./about/About"));

var _MapView = _interopRequireDefault(require("./../views/map/MapView"));

var _NavBar = _interopRequireDefault(require("./../components/nav/NavBar"));

require("./App.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function RouterComponent() {
  return /*#__PURE__*/React.createElement(_reactRouterDom.BrowserRouter, null, /*#__PURE__*/React.createElement(_NavBar.default, null), /*#__PURE__*/React.createElement(_reactRouterDom.Route, {
    path: "/",
    exact: true,
    render: function render() {
      return /*#__PURE__*/React.createElement(_MapView.default, null);
    }
  }), /*#__PURE__*/React.createElement(_reactRouterDom.Route, {
    path: "/map",
    exact: true,
    render: function render() {
      return /*#__PURE__*/React.createElement(_MapView.default, null);
    }
  }));
}

function App() {
  return /*#__PURE__*/React.createElement("div", {
    className: "App"
  }, /*#__PURE__*/React.createElement(RouterComponent, null), /*#__PURE__*/React.createElement("h1", null, "FOOTER"));
}

var _default = App;
exports.default = _default;