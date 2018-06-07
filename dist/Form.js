"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Form = exports.actionCreators = exports.html5form = exports.InputGroup = undefined;

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

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

var _Reducers = require("./Redux/Reducers");

Object.defineProperty(exports, "html5form", {
  enumerable: true,
  get: function get() {
    return _Reducers.html5form;
  }
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Context = require("./Form/Context");

var _Actions = require("./Redux/Actions");

var actions = _interopRequireWildcard(_Actions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var actionCreators = exports.actionCreators = actions;

var AUTOCOMPLETE_TIMEOUT = 50;
var counter = 0;

var Form = exports.Form = function (_React$Component) {
  (0, _inherits3.default)(Form, _React$Component);

  function Form(props) {
    (0, _classCallCheck3.default)(this, Form);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Form.__proto__ || (0, _getPrototypeOf2.default)(Form)).call(this, props));

    _this.valid = false;
    counter++, _this.id = props.id || "__form" + counter;

    _this.updateStoreForFormValidity(true, "");

    _this.form = _react2.default.createRef();
    _this.onSubmit = _this.onSubmit.bind(_this);

    /***
    * Set pristine to true when first input
    */
    var setPristine = function setPristine() {
      if (!_this.state.pristine) {
        return;
      }
      _this.setState({
        pristine: false
      });
    };

    var registerInputGroup = function registerInputGroup(instance) {
      _this.setState(function (state) {
        return {
          inputGroups: [].concat((0, _toConsumableArray3.default)(state.inputGroups), [instance])
        };
      });
    };

    var updateStoreForInputGroupValidity = function updateStoreForInputGroupValidity(groupId, valid, errors) {
      var formActions = props.formActions;

      formActions && formActions.updateInputGroupValidity(_this.id, groupId, valid, errors);
    };

    var updateStoreForInputValidity = function updateStoreForInputValidity(groupId, name, validity, validationMessage) {
      var formActions = props.formActions;

      formActions && formActions.updateInputValidity(_this.id, groupId, name, validity, validationMessage);
    };

    var updateStoreForPristine = function updateStoreForPristine(groupId) {
      var formActions = props.formActions;

      formActions && formActions.updatePristine(_this.id, groupId);
    };

    _this.setError = function (message) {
      _this.updateStoreForFormValidity(message, _this.valid);
      _this.setState({ error: message });
    };

    _this.state = {
      valid: true,
      error: null,
      inputGroups: [],
      pristine: true,
      submitting: false,
      submitted: false,
      registerInputGroup: registerInputGroup,
      updateStoreForInputGroupValidity: updateStoreForInputGroupValidity,
      updateStoreForInputValidity: updateStoreForInputValidity,
      setPristine: setPristine,
      updateStoreForPristine: updateStoreForPristine,
      setError: _this.setError
    };
    return _this;
  }

  /**
   * Invoke onUpdate handler
   * @param {Object} prevProps
   * @parma {Object} prevState
   */


  (0, _createClass3.default)(Form, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var _props = this.props,
          onUpdate = _props.onUpdate,
          inputGroups = _props.inputGroups;

      if (onUpdate && this.state.inputGroups.length && this.state.valid !== prevState.valid) {
        onUpdate(this);
      }
    }

    /**
     * Invoke onMount handler
     */

  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var onMount = this.props.onMount;

      setTimeout(function () {
        onMount ? onMount(_this2) : _this2.checkValidityAndUpdate();
      }, AUTOCOMPLETE_TIMEOUT);
    }

    /**
     * Update Redux store for form validity
     * @param {Boolean} valid
     * @param {String} error
     */

  }, {
    key: "updateStoreForFormValidity",
    value: function updateStoreForFormValidity(valid, error) {
      var formActions = this.props.formActions;

      formActions && formActions.updateFormValidity(this.id, valid, error);
    }
    /**
     * Toogle form state prop submitted
     */

  }, {
    key: "updateSubmitted",
    value: function updateSubmitted() {
      var formActions = this.props.formActions;

      this.setState({ submitted: true });
      formActions && formActions.updateSubmitted(this.id);
    }

    /**
     * Abstract method to be overriden by a concrete implementation
     * @param {Event} e
     */

  }, {
    key: "onSubmit",
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var onSubmit;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                onSubmit = this.props.onSubmit;

                e && e.preventDefault();
                this.toggleSubmitting(true);
                this.checkValidityAndUpdateInputGroups();
                this.valid || this.scrollIntoViewFirstInvalidInputGroup();

                if (!(this.valid && onSubmit)) {
                  _context.next = 8;
                  break;
                }

                _context.next = 8;
                return onSubmit.call(this, this);

              case 8:
                this.toggleSubmitting(false);
                this.updateSubmitted();

              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function onSubmit() {
        return _ref.apply(this, arguments);
      }

      return onSubmit;
    }()
    /**
     * Toggle submitting state
     * @param {boolean} submitting
     */

  }, {
    key: "toggleSubmitting",
    value: function toggleSubmitting() {
      var submitting = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var formActions = this.props.formActions;

      formActions && formActions.updateSubmitting(this.id, submitting);
      this.setState({ submitting: submitting });
    }

    /**
     * Shortcut to submit form
     */

  }, {
    key: "submit",
    value: function submit() {
      this.getRef().current.submit();
    }

    /**
     * Shortcut to access Ref on bounding DOM node
     */

  }, {
    key: "getRef",
    value: function getRef() {
      return this.form;
    }

    /**
     * Find the first input group in error state
     * @returns {InputGroup}
     */

  }, {
    key: "getFirstInvalidInputGroup",
    value: function getFirstInvalidInputGroup() {
      return this.state.inputGroups.find(function (group) {
        return !group.valid;
      });
    }

    /**
     * Get debug info about registered input groups
     * @param {Number} inx
     * @returns {Object}
     */

  }, {
    key: "debugInputGroups",
    value: function debugInputGroups() {
      var inx = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      var debug = this.state.inputGroups.map(function (inputGroup) {
        return {
          name: inputGroup.inputGroup.current.name || "undefined",
          valid: inputGroup.checkValidity(),
          inputs: inputGroup.inputs.map(function (input) {
            return {
              name: input.name,
              valid: input.checkValidity()
            };
          })
        };
      });
      return inx === null ? debug : debug[inx];
    }

    /**
     * Scroll the first errored input group into view
     */

  }, {
    key: "scrollIntoViewFirstInvalidInputGroup",
    value: function scrollIntoViewFirstInvalidInputGroup() {
      var firstInvalid = this.getFirstInvalidInputGroup();
      if (firstInvalid && "scrollIntoView" in firstInvalid.inputGroup.current) {
        firstInvalid.inputGroup.current.scrollIntoView();
      }
    }

    /**
     * Check form validity and update every input group
     */

  }, {
    key: "checkValidityAndUpdateInputGroups",
    value: function checkValidityAndUpdateInputGroups() {
      var valid = this.checkValidity("checkValidityAndUpdate");
      this.setState({ valid: valid });
      return valid;
    }

    /**
     * Check form validity and update the component state
     */

  }, {
    key: "checkValidityAndUpdate",
    value: function checkValidityAndUpdate() {
      var valid = this.checkValidity("checkValidity");
      this.setState({ valid: valid });
      return valid;
    }

    /**
     * Get form actual validity by logical conjunction of all registered inputs
     * @param {String} [groupMethod = "checkValidityAndUpdate"]
     * @returns {Boolean}
     */

  }, {
    key: "checkValidity",
    value: function checkValidity() {
      var groupMethod = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "checkValidityAndUpdate";

      this.valid = this.state.inputGroups.reduce(function (isValid, group) {
        var valid = group[groupMethod]();
        return valid && isValid;
      }, true);
      this.updateStoreForFormValidity(this.valid, this.state.error);
      return this.valid;
    }

    /**
     * Extract properties for delegation to generated form element
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
          inputs = _props2.inputs,
          children = _props2.children,
          formActions = _props2.formActions,
          formState = _props2.formState,
          _state = this.state,
          error = _state.error,
          valid = _state.valid,
          pristine = _state.pristine,
          submitting = _state.submitting,
          submitted = _state.submitted,
          context = (0, _extends3.default)({}, this.state, { formActions: formActions, formState: formState }),
          form = this,
          tagProps = Form.normalizeTagProps(this.props);


      return _react2.default.createElement(
        _Context.FormContext.Provider,
        { value: context },
        _react2.default.createElement(
          "form",
          (0, _extends3.default)({ noValidate: true, ref: this.form }, tagProps, { onSubmit: this.onSubmit }),
          children({ error: error, valid: valid, pristine: pristine, submitting: submitting, submitted: submitted, form: form })
        )
      );
    }
  }], [{
    key: "normalizeTagProps",
    value: function normalizeTagProps(props) {
      var whitelisted = (0, _extends3.default)({}, props);
      ["onSubmit", "onMount", "onUpdate", "formActions", "formState"].forEach(function (prop) {
        if (prop in whitelisted) {
          delete whitelisted[prop];
        }
      });
      return whitelisted;
    }
  }]);
  return Form;
}(_react2.default.Component);

Form.propTypes = {
  onSubmit: _propTypes2.default.func,
  onMount: _propTypes2.default.func,
  onUpdate: _propTypes2.default.func,
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