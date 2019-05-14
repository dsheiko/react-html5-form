"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

exports.html5form = html5form;

var _Constants = require("../Constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultState = {
  forms: {}
};

function html5form() {
  var prevState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;

  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { type: null, payload: {} },
      type = _ref.type,
      payload = _ref.payload;

  var state = JSON.parse((0, _stringify2.default)(prevState));
  switch (type) {
    case _Constants.UPDATE_INPUT_VALIDITY:
      var formId = payload.formId,
          groupId = payload.groupId,
          name = payload.name,
          validity = payload.validity,
          validationMessage = payload.validationMessage;

      if (!(formId in state.forms) || !state.forms[formId].inputGroups || !(groupId in state.forms[formId].inputGroups)) {
        return state;
      }
      var inputGroups = state.forms[payload.formId].inputGroups;
      if (!("inputs" in inputGroups[groupId])) {
        inputGroups[groupId].inputs = {};
      }
      inputGroups[groupId].inputs[name] = {
        name: name,
        validity: validity,
        validationMessage: validationMessage
      };
      return state;

    case _Constants.UPDATE_PRISTINE:
      if (!(payload.formId in state.forms)) {
        return state;
      }
      state.forms[payload.formId].pristine = false;
      return state;

    case _Constants.UPDATE_FORM_SUBMITTING:
      if (!(payload.formId in state.forms)) {
        return state;
      }
      state.forms[payload.formId].submitting = payload.submitting;
      return state;

    case _Constants.UPDATE_FORM_SUBMITTED:
      if (!(payload.formId in state.forms)) {
        return state;
      }
      state.forms[payload.formId].submitted = true;
      return state;

    case _Constants.UPDATE_INPUT_GROUP_VALIDITY:
      if (!(payload.formId in state.forms)) {
        return state;
      }
      if (!("inputGroups" in state.forms[payload.formId])) {
        state.forms[payload.formId].inputGroups = {};
      }
      var iGroups = state.forms[payload.formId].inputGroups;
      iGroups[payload.groupId] = {
        id: payload.groupId,
        valid: payload.valid,
        errors: payload.errors
      };
      return state;

    case _Constants.UPDATE_FORM_VALIDITY:
      var prev = payload.formId in state.forms ? state.forms[payload.formId] : {};
      state.forms[payload.formId] = (0, _extends3.default)({}, prev, {
        id: payload.formId,
        valid: payload.valid,
        error: payload.error,
        pristine: true,
        submitting: false,
        submitted: false
      });
      return state;

    default:
      return state;
  }
}