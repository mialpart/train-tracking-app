"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _logo = _interopRequireDefault(require("./../../assets/images/logo.svg"));

require("./Profile.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Profile() {
  return /*#__PURE__*/React.createElement("div", {
    className: "App"
  }, /*#__PURE__*/React.createElement("h1", null, "PROFILE"), /*#__PURE__*/React.createElement("header", {
    className: "App-header"
  }, /*#__PURE__*/React.createElement("img", {
    src: _logo.default,
    className: "App-logo",
    alt: "logo"
  })));
}

var _default = Profile;
exports.default = _default;