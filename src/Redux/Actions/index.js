import { UPDATE_INPUT_VALIDITY, UPDATE_INPUT_GROUP_VALIDITY, UPDATE_FORM_VALIDITY } from "../Constants";

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
