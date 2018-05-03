"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InputGroup = exports.InputGroupComponent = undefined;

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

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

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Context = require("./Context");

var _Input = require("./InputGroup/Input");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var InputGroupComponent = exports.InputGroupComponent = function (_React$Component) {
  (0, _inherits3.default)(InputGroupComponent, _React$Component);

  function InputGroupComponent(props) {
    (0, _classCallCheck3.default)(this, InputGroupComponent);

    var _this = (0, _possibleConstructorReturn3.default)(this, (InputGroupComponent.__proto__ || (0, _getPrototypeOf2.default)(InputGroupComponent)).call(this, props));

    _this.inputGroup = _react2.default.createRef();
    _this.valid = true;
    _this.state = {
      valid: true,
      error: null,
      errors: []
    };
    return _this;
  }

  (0, _createClass3.default)(InputGroupComponent, [{
    key: "extractInputNames",
    value: function extractInputNames(validate) {
      if (Array.isArray(validate)) {
        return validate;
      }
      return (0, _keys2.default)(validate);
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var _props = this.props,
          validate = _props.validate,
          registerInputGroup = _props.registerInputGroup,
          translate = _props.translate,
          names = this.extractInputNames(validate);

      this.inputs = names.map(function (name) {
        var selector = "[name=\"" + name + "\"]",
            customValidator = name in validate ? validate[name] : function () {
          return true;
        },
            tMap = translate && name in translate ? translate[name] : null,
            el = _this2.inputGroup.current.querySelector(selector);

        if (!el) {
          _this2.updateState(["Could not find selector " + selector], false);
          return null;
        }
        return new _Input.Input({ el: el, name: name, customValidator: customValidator, translate: tMap });
      }).filter(function (el) {
        return Boolean(el);
      });

      registerInputGroup(this);
    }
  }, {
    key: "getValidationMessages",
    value: function getValidationMessages() {
      return this.inputs.map(function (input) {
        return input.getValidationMessage();
      }).filter(function (msg) {
        return Boolean(msg);
      });
    }
  }, {
    key: "updateState",
    value: function updateState(errors, valid) {
      this.setState({
        valid: valid,
        error: errors.length ? errors[0] : null,
        errors: errors
      });
    }
  }, {
    key: "getInputByName",
    value: function getInputByName(name) {
      if (!this.inputs) {
        return null;
      }
      return this.inputs.find(function (input) {
        return input.name === name;
      });
    }
  }, {
    key: "checkValidityAndUpdate",
    value: function checkValidityAndUpdate() {
      var valid = this.checkValidity();
      if (valid) {
        this.updateState([], true);
        return true;
      }
      this.updateState(this.getValidationMessages(), false);
      return false;
    }
  }, {
    key: "checkValidity",
    value: function checkValidity() {
      this.valid = this.inputs.reduce(function (isValid, input) {
        return input.checkValidity() && isValid;
      }, true);
      return this.valid;
    }
  }, {
    key: "render",
    value: function render() {
      var _props2 = this.props,
          children = _props2.children,
          _props2$tag = _props2.tag,
          tag = _props2$tag === undefined ? "div" : _props2$tag,
          className = _props2.className,
          Container = "" + tag,
          args = (0, _extends3.default)({}, this.state, { inputGroup: this });

      return _react2.default.createElement(
        Container,
        { ref: this.inputGroup, className: className },
        children(args),
        " "
      );
    }
  }]);
  return InputGroupComponent;
}(_react2.default.Component);

;

var InputGroup = exports.InputGroup = function InputGroup(props) {
  return _react2.default.createElement(
    _Context.FormContext.Consumer,
    null,
    function (_ref) {
      var registerInputGroup = _ref.registerInputGroup;
      return _react2.default.createElement(InputGroupComponent, (0, _extends3.default)({}, props, { registerInputGroup: registerInputGroup }));
    }
  );
};

InputGroup.propTypes = {
  validate: _propTypes2.default.oneOfType([_propTypes2.default.object, _propTypes2.default.array]).isRequired,
  translate: _propTypes2.default.object,
  tag: _propTypes2.default.string,
  className: _propTypes2.default.string
};