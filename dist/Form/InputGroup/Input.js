"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Input = undefined;

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var VALIDITY_PROPS = ["badInput", "customError", "patternMismatch", "rangeOverflow", "rangeUnderflow", "stepMismatch", "tooLong", "tooShort", "typeMismatch", "valueMissing"];

var Input = exports.Input = function () {
  function Input(_ref) {
    var el = _ref.el,
        name = _ref.name,
        customValidator = _ref.customValidator,
        translate = _ref.translate;
    (0, _classCallCheck3.default)(this, Input);

    this.current = el;
    this.name = name;
    this.customValidator = customValidator;
    this.assignedValidationMessages = {};
    this.applyValidationMessageMapping(translate);
  }

  (0, _createClass3.default)(Input, [{
    key: "setCustomValidity",
    value: function setCustomValidity() {
      var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

      return this.current.setCustomValidity(message);
    }
  }, {
    key: "checkValidity",
    value: function checkValidity() {
      this.setCustomValidity();
      return this.current.checkValidity() && this.customValidator(this);
    }
  }, {
    key: "applyValidationMessageMapping",
    value: function applyValidationMessageMapping(translate) {
      var _this = this;

      translate && (0, _keys2.default)(translate).forEach(function (key) {
        _this.assignValidationMessage(key, translate[key]);
      });
    }

    /**
     * Assign custom message to one of ValidityState property
     * in scope of the fieldset
     *
     * @public
     * @param {string} prop
     * @param {string} message
     */

  }, {
    key: "assignValidationMessage",
    value: function assignValidationMessage(prop, message) {
      if (VALIDITY_PROPS.indexOf(prop) === -1) {
        throw new Error("Invalid validity property " + prop);
      }
      this.assignedValidationMessages[prop] = message;
    }

    /**
     * Obtain message assotiated with currently invalid state prop or false if none is
     *
     * @param {ValidityState} validity
     * @returns {string|false}
     */

  }, {
    key: "getAssignedValidationMessage",
    value: function getAssignedValidationMessage(validity) {
      var invalidProp = VALIDITY_PROPS.find(function (prop) {
        return validity[prop];
      });
      return invalidProp && invalidProp in this.assignedValidationMessages ? this.assignedValidationMessages[invalidProp] : false;
    }

    /**
    * Try to get message associated with currently invalid state property
    * If failed, standard assiciated message
    * If failed, browser validation message
    * @returns {string}
    */

  }, {
    key: "getValidationMessage",
    value: function getValidationMessage() {
      var validity = this.current.validity,
          assignedMessage = this.getAssignedValidationMessage(validity);

      if (assignedMessage) {
        return assignedMessage;
      }

      switch (true) {
        case validity.valueMissing:
          return "Please fill out this field.";
        case validity.rangeOverflow:
          return "Value must be less than or equal to " + this.current.max + ".";
        case validity.rangeUnderflow:
          return "Value must be greater than or equal to " + this.current.min + ".";
        case validity.tooLong:
          return "Value must be less than " + this.current.maxlength + " length.";
        case validity.tooShort:
          return "Value must be more than " + this.current.minlength + " length.";
        case validity.typeMismatch:
          return "Value is not a valid " + this.current.type + ".";
      }

      return this.current.validationMessage;
    }
  }]);
  return Input;
}();