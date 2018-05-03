"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Form = exports.InputGroup = undefined;

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _InputGroup = require("./Form/InputGroup");

Object.defineProperty(exports, "InputGroup", {
  enumerable: true,
  get: function get() {
    return _InputGroup.InputGroup;
  }
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Context = require("./Form/Context");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Form = exports.Form = function (_React$Component) {
  (0, _inherits3.default)(Form, _React$Component);

  function Form(props) {
    (0, _classCallCheck3.default)(this, Form);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Form.__proto__ || (0, _getPrototypeOf2.default)(Form)).call(this, props));

    _this.form = _react2.default.createRef();
    _this.onSubmit = _this.onSubmit.bind(_this);

    _this.registerInputGroup = function (instance) {
      _this.setState(function (state) {
        return {
          inputGroups: [].concat((0, _toConsumableArray3.default)(state.inputGroups), [instance])
        };
      });
    };

    _this.setError = function (message) {
      _this.setState({ error: message });
    };

    _this.state = {
      valid: true,
      error: null,
      inputGroups: [],
      registerInputGroup: _this.registerInputGroup,
      setError: _this.setError
    };
    return _this;
  }

  /**
   * Abstract method to be overriden by a concrete implementation
   */


  (0, _createClass3.default)(Form, [{
    key: "onSubmit",
    value: function onSubmit(e) {
      var onSubmit = this.props.onSubmit;

      e.preventDefault();
      this.setState({ valid: this.checkValidity() });
      onSubmit && onSubmit.call(this, this);
    }

    /**
     * Scroll the first errored input group into view
     */

  }, {
    key: "scrollIntoViewFirstInvalidInputGroup",
    value: function scrollIntoViewFirstInvalidInputGroup() {
      var firstInvalid = this.state.inputGroups.find(function (group) {
        return !group.valid;
      });
      if (firstInvalid && "scrollIntoView" in firstInvalid) {
        firstInvalid.scrollIntoView();
      }
    }
  }, {
    key: "checkValidity",
    value: function checkValidity() {
      var valid = this.state.inputGroups.reduce(function (isValid, group) {
        return group.checkValidityAndUpdate() && isValid;
      }, true);
      valid || this.scrollIntoViewFirstInvalidInputGroup();
      return valid;
    }
  }, {
    key: "render",
    value: function render() {
      var _props = this.props,
          inputs = _props.inputs,
          children = _props.children,
          _state = this.state,
          error = _state.error,
          valid = _state.valid,
          form = this,
          tagProps = Form.normalizeTagProps(this.props);


      return _react2.default.createElement(
        _Context.FormContext.Provider,
        { value: this.state },
        _react2.default.createElement(
          "form",
          (0, _extends3.default)({ noValidate: true, ref: this.form }, tagProps, { onSubmit: this.onSubmit }),
          children({ error: error, valid: valid, form: form })
        )
      );
    }
  }], [{
    key: "normalizeTagProps",
    value: function normalizeTagProps(props) {
      var whitelisted = (0, _extends3.default)({}, props);
      if ("onSubmit" in whitelisted) {
        delete whitelisted["onSubmit"];
      }
      return whitelisted;
    }
  }]);
  return Form;
}(_react2.default.Component);

Form.propTypes = {
  onSubmit: _propTypes2.default.func,
  tabindex: _propTypes2.default.string,
  title: _propTypes2.default.string,
  id: _propTypes2.default.string,
  className: _propTypes2.default.string,
  action: _propTypes2.default.string,
  autoComplete: _propTypes2.default.string,
  encType: _propTypes2.default.string,
  method: _propTypes2.default.string,
  name: _propTypes2.default.string,
  target: _propTypes2.default.string
};