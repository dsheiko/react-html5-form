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

var counter = 0;

var InputGroupComponent = exports.InputGroupComponent = function (_React$Component) {
  (0, _inherits3.default)(InputGroupComponent, _React$Component);

  function InputGroupComponent(props) {
    (0, _classCallCheck3.default)(this, InputGroupComponent);

    var _this = (0, _possibleConstructorReturn3.default)(this, (InputGroupComponent.__proto__ || (0, _getPrototypeOf2.default)(InputGroupComponent)).call(this, props));

    counter++, _this.id = "id" in props ? props.id : "__igroup" + counter;
    _this.inputGroup = _react2.default.createRef();
    _this.valid = true;

    _this.state = {
      valid: true,
      error: null,
      errors: [],
      pristine: true
    };
    return _this;
  }

  /***
   * Set pristine to true when first input
   */


  (0, _createClass3.default)(InputGroupComponent, [{
    key: "setPristine",
    value: function setPristine() {
      this.props.setPristine();
      if (!this.state.pristine) {
        return;
      }
      this.props.updateStoreForPristine(this.id);
      this.setState({
        pristine: false
      });
    }

    /**
     * Shortcut to access Ref on bounding DOM node
     */

  }, {
    key: "getRef",
    value: function getRef() {
      return this.inputGroup;
    }

    /**
     * Helper to extract input names for both syntaxes valid for validate prop
     * @param {*} validate
     * @returns {Array}
     */

  }, {
    key: "extractInputNames",
    value: function extractInputNames(validate) {
      if (Array.isArray(validate)) {
        return validate;
      }
      return (0, _keys2.default)(validate);
    }

    /**
    * Invoke onUpdate handler
    * @param {Object} prevProps
    * @parma {Object} prevState
    */

  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var onUpdate = this.props.onUpdate;

      if (onUpdate && this.state.valid !== prevState.valid) {
        onUpdate(this);
      }
    }

    /**
     * Register inputs by props validate and translate. Invoke onMount
     */

  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var _props = this.props,
          validate = _props.validate,
          registerInputGroup = _props.registerInputGroup,
          translate = _props.translate,
          onMount = _props.onMount,
          updateStoreForInputGroupValidity = _props.updateStoreForInputGroupValidity,
          setPristine = _props.setPristine,
          names = this.extractInputNames(validate);


      this.inputs = names.map(function (name) {
        var selector = "[name=\"" + name + "\"]",
            customValidator = name in validate ? validate[name] : function () {
          return true;
        },
            tMap = translate && name in translate ? translate[name] : null,
            locator = function locator() {
          return _this2.inputGroup.current.querySelector(selector);
        };

        return new _Input.Input({ locator: locator, name: name, customValidator: customValidator, translate: tMap, parent: _this2 });
      });
      // Register input group in redux store
      updateStoreForInputGroupValidity(this.id, true, []);
      registerInputGroup(this);
      onMount && onMount(this);
    }

    /**
     * Get array of input validation messages
     * @returns {String[]}
     */

  }, {
    key: "getValidationMessages",
    value: function getValidationMessages() {
      return this.inputs.map(function (input) {
        return input.getValidationMessage();
      }).filter(function (msg) {
        return Boolean(msg);
      });
    }

    /**
     * Update Redux store for input validity
     * @param {string} name
     * @param {Object} validity
     * @param {string} validationMessage
     */

  }, {
    key: "updateStoreForInputValidity",
    value: function updateStoreForInputValidity(name, validity, validationMessage) {
      this.props.updateStoreForInputValidity(this.id, name, validity, validationMessage);
    }

    /**
     * Helper to update component state
     * @param {String[]} errors
     * @param {Boolean} valid
     */

  }, {
    key: "updateState",
    value: function updateState(errors, valid) {
      this.props.updateStoreForInputGroupValidity(this.id, valid, errors);
      this.setState({
        valid: valid,
        error: errors.length ? errors[0] : null,
        errors: errors
      });
    }

    /**
     * Get input by its name
     * @param {String} name
     * @returns {Input}
     */

  }, {
    key: "getInputByName",
    value: function getInputByName(name) {
      if (!this.inputs || !this.inputs.length) {
        return null;
      }
      return this.inputs.find(function (input) {
        return input.name === name;
      });
    }

    /**
     * Check form validity and update the sate
     */

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

    /**
     * Get group actual validity by logical conjunction of all registered inputs
     * @returns {Boolean}
     */

  }, {
    key: "checkValidity",
    value: function checkValidity() {
      this.valid = this.inputs.reduce(function (isValid, input) {
        return input.checkValidity() && isValid;
      }, true);
      return this.valid;
    }

    /**
     * Extract properties for delegation to generated element
     *
     * @param {Object} props
     * @returns {Object}
     */

  }, {
    key: "render",


    /**
    * Render the component
    * @returns {React.Component}
    */
    value: function render() {
      var _props2 = this.props,
          children = _props2.children,
          _props2$tag = _props2.tag,
          tag = _props2$tag === undefined ? "div" : _props2$tag,
          className = _props2.className,
          updateInputValidity = _props2.updateInputValidity,
          formAction = _props2.formAction,
          formState = _props2.formState,
          Container = "" + tag,
          props = (0, _extends3.default)({ id: this.id }, this.props),
          tagProps = InputGroupComponent.normalizeTagProps(props),
          args = (0, _extends3.default)({}, this.state, { inputGroup: this });


      return _react2.default.createElement(
        Container,
        (0, _extends3.default)({ ref: this.inputGroup }, tagProps),
        children(args),
        " "
      );
    }
  }], [{
    key: "normalizeTagProps",
    value: function normalizeTagProps(props) {
      var whitelisted = (0, _extends3.default)({}, props);
      ["validate", "translate", "tag", "registerInputGroup", "onMount", "onUpdate", "updateStoreForInputValidity", "updateStoreForInputGroupValidity", "setPristine", "updateStoreForPristine"].forEach(function (prop) {
        if (prop in whitelisted) {
          delete whitelisted[prop];
        }
      });
      return whitelisted;
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
      var registerInputGroup = _ref.registerInputGroup,
          setPristine = _ref.setPristine,
          updateStoreForInputGroupValidity = _ref.updateStoreForInputGroupValidity,
          updateStoreForInputValidity = _ref.updateStoreForInputValidity,
          updateStoreForPristine = _ref.updateStoreForPristine;
      return _react2.default.createElement(InputGroupComponent, (0, _extends3.default)({}, props, {
        setPristine: setPristine,
        registerInputGroup: registerInputGroup,
        updateStoreForInputValidity: updateStoreForInputValidity,
        updateStoreForInputGroupValidity: updateStoreForInputGroupValidity,
        updateStoreForPristine: updateStoreForPristine
      }));
    }
  );
};

InputGroup.propTypes = {
  validate: _propTypes2.default.oneOfType([_propTypes2.default.object, _propTypes2.default.array]).isRequired,
  onUpdate: _propTypes2.default.func,
  onMount: _propTypes2.default.func,
  translate: _propTypes2.default.object,
  tag: _propTypes2.default.string,
  className: _propTypes2.default.string
};

InputGroupComponent.propTypes = (0, _extends3.default)({}, InputGroup.propTypes, {
  registerInputGroup: _propTypes2.default.func,
  setPristine: _propTypes2.default.func,
  updateStoreForInputValidity: _propTypes2.default.func,
  updateStoreForInputGroupValidity: _propTypes2.default.func,
  updateStoreForPristine: _propTypes2.default.func
});