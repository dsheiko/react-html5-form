"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateSubmitting = exports.updatePristine = exports.updateFormValidity = exports.updateInputGroupValidity = exports.updateInputValidity = undefined;

var _Constants = require("../Constants");

var updateInputValidity = exports.updateInputValidity = function updateInputValidity() {
  var formId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  var groupId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
  var validity = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var validationMessage = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "";
  return {
    type: _Constants.UPDATE_INPUT_VALIDITY,
    payload: {
      name: name,
      validity: validity,
      validationMessage: validationMessage,
      formId: formId,
      groupId: groupId
    }
  };
};

var updateInputGroupValidity = exports.updateInputGroupValidity = function updateInputGroupValidity() {
  var formId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  var groupId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  var valid = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var errors = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  return {
    type: _Constants.UPDATE_INPUT_GROUP_VALIDITY,
    payload: {
      valid: valid,
      errors: errors,
      groupId: groupId,
      formId: formId
    }
  };
};

var updateFormValidity = exports.updateFormValidity = function updateFormValidity() {
  var formId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  var valid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var error = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  return {
    type: _Constants.UPDATE_FORM_VALIDITY,
    payload: {
      valid: valid, error: error, formId: formId
    }
  };
};

var updatePristine = exports.updatePristine = function updatePristine() {
  var formId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  var groupId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  return {
    type: _Constants.UPDATE_PRISTINE,
    payload: {
      groupId: groupId,
      formId: formId
    }
  };
};

var updateSubmitting = exports.updateSubmitting = function updateSubmitting() {
  var formId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  var submitting = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return {
    type: _Constants.UPDATE_FORM_SUBMITTING,
    payload: { formId: formId, submitting: submitting }
  };
};