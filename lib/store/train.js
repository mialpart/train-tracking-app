"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toolkit = require("@reduxjs/toolkit");

var _trainSlicer = _interopRequireDefault(require("./features/trainSlicer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _toolkit.configureStore)({
  reducer: {
    train: _trainSlicer.default
  }
});

exports.default = _default;