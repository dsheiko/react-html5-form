import {
  UPDATE_INPUT_VALIDITY,
  UPDATE_INPUT_GROUP_VALIDITY,
  UPDATE_FORM_VALIDITY,
  UPDATE_PRISTINE,
  UPDATE_FORM_SUBMITTING,
  UPDATE_FORM_SUBMITTED } from "../Constants";

export const updateInputValidity = (
  formId = "", groupId = "", name = "", validity = {}, validationMessage = "") => ({
    type: UPDATE_INPUT_VALIDITY,
    payload: {
      name,
      validity,
      validationMessage,
      formId,
      groupId
    }
});

export const updateInputGroupValidity = (
  formId = "", groupId = "", valid = true, errors = []) => ({
    type: UPDATE_INPUT_GROUP_VALIDITY,
    payload: {
      valid,
      errors,
      groupId,
      formId
    }
});

export const updateFormValidity = (
  formId = "", valid = true, error = []) => ({
    type: UPDATE_FORM_VALIDITY,
    payload: {
      valid, error, formId
    }
});

export const updatePristine = (
  formId = "", groupId = "") => ({
    type: UPDATE_PRISTINE,
    payload: {
      groupId,
      formId
    }
});

export const updateSubmitting = ( formId = "", submitting = false ) => ({
    type: UPDATE_FORM_SUBMITTING,
    payload: { formId, submitting }
});

export const updateSubmitted = ( formId = "" ) => ({
    type: UPDATE_FORM_SUBMITTED,
    payload: { formId }
});
