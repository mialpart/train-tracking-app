"use strict";

var _react = require("@testing-library/react");

var _Profile = _interopRequireDefault(require("./Profile"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

test('renders learn react link', function () {
  (0, _react.render)( /*#__PURE__*/React.createElement(_Profile.default, null));

  var linkElement = _react.screen.getByText(/learn react/i);

  expect(linkElement).toBeInTheDocument();
});