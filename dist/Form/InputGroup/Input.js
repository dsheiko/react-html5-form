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

var DEFAULT_VALIDITY = {
  badInput: false,
  customError: false,
  patternMismatch: false,
  rangeOverflow: false,
  rangeUnderflow: false,
  stepMismatch: false,
  tooLong: false,
  tooShort: false,
  typeMismatch: false,
  valueMissing: false,
  valid: true
};

var Input = exports.Input = function () {
  function Input(_ref) {
    var _this = this;

    var locator = _ref.locator,
        name = _ref.name,
        customValidator = _ref.customValidator,
        translate = _ref.translate,
        parent = _ref.parent;
    (0, _classCallCheck3.default)(this, Input);

    this.locator = locator;
    this.name = name;
    this.customValidator = customValidator;
    this.assignedValidationMessages = {};
    this.applyValidationMessageMapping(translate);
    this.parent = parent;
    this.parent.updateStoreForInputValidity(name, DEFAULT_VALIDITY, "");
    this.setPristine = function () {
      _this.parent.setPristine();
    };
    this.subscribePristineHandler();
  }

  /**
   * Change Pristine on the first input
   */


  (0, _createClass3.default)(Input, [{
    key: "subscribePristineHandler",
    value: function subscribePristineHandler() {
      var el = this.current;
      if (!el) {
        return;
      }
      el.addEventListener("input", this.setPristine, false);
    }
  }, {
    key: "setCustomValidity",


    /**
     * Shortcut to setCustomValidity on DOM node
     * @param {String} message
     */
    value: function setCustomValidity() {
      var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

      return this.current.setCustomValidity(message);
    }

    /**
     * Check checkValidity implementaiton. First it resets custom validity and gets input validity logical conjunction
     * DOM node one and registered custom validator
     * @returns {Boolean}
     */

  }, {
    key: "checkValidity",
    value: function checkValidity() {
      if (!this.current) {
        return false;
      }
      this.setCustomValidity();
      var valid = this.current.checkValidity() && this.customValidator(this);
      this.parent.updateStoreForInputValidity(this.name, this.getValidity(), this.getValidationMessage());
      return valid;
    }

    /**
     * Get validity as a plain object
     * @returns {Object}
     */

  }, {
    key: "getValidity",
    value: function getValidity() {
      var _this2 = this;

      if (!this.current) {
        return DEFAULT_VALIDITY;
      }
      return (0, _keys2.default)(DEFAULT_VALIDITY).reduce(function (carry, prop) {
        carry[prop] = _this2.current.validity[prop];
        return carry;
      }, {});
    }

    /**
     * Process object passed with translate
     * @param {Object} translate
     */

  }, {
    key: "applyValidationMessageMapping",
    value: function applyValidationMessageMapping(translate) {
      var _this3 = this;

      translate && (0, _keys2.default)(translate).forEach(function (key) {
        _this3.assignValidationMessage(key, translate[key]);
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
      if ((0, _keys2.default)(DEFAULT_VALIDITY).indexOf(prop) === -1) {
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
      var invalidProp = (0, _keys2.default)(DEFAULT_VALIDITY).find(function (prop) {
        return validity[prop];
      });
      return invalidProp && invalidProp in this.assignedValidationMessages ? this.assignedValidationMessages[invalidProp] : false;
    }

    /**
    * Try to get message associated with currently invalid state property
    * If failed, standard assiciated message
    * If failed, browser validation message
    * @param {ValidityState} [validityState=null]
    * @returns {string}
    */

  }, {
    key: "getValidationMessage",
    value: function getValidationMessage() {
      var validityState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      var validity = validityState || this.getValidity(),
          assignedMessage = this.getAssignedValidationMessage(validity);

      if (assignedMessage) {
        return assignedMessage;
      }

      if (!this.current) {
        return "";
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
  }, {
    key: "current",
    get: function get() {
      if (!this.currentCache) {
        this.currentCache = this.locator();
      }
      if (!this.currentCache) {
        this.parent.updateState(["Could not find selector [name=\"" + this.name + "\"]"], false);
      }
      return this.currentCache;
    }
  }]);
  return Input;
}();