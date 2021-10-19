"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _logo = _interopRequireDefault(require("./../../assets/images/logo.svg"));

require("./About.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function About() {
  return /*#__PURE__*/React.createElement("div", {
    className: "App"
  }, /*#__PURE__*/React.createElement("h1", null, "ABOUT"), /*#__PURE__*/React.createElement("header", {
    className: "App-header"
  }, /*#__PURE__*/React.createElement("img", {
    src: _logo.default,
    className: "App-logo",
    alt: "logo"
  })));
}

var _default = About;
exports.default = _default;