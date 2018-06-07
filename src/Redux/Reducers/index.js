import { UPDATE_INPUT_VALIDITY,
         DEFAULT_VALIDITY,
         UPDATE_INPUT_GROUP_VALIDITY,
         UPDATE_PRISTINE,
         UPDATE_FORM_SUBMITTING,
         UPDATE_FORM_VALIDITY,
         UPDATE_FORM_SUBMITTED } from "../Constants";

const defaultState = {
  forms: {}
};

export function html5form( prevState = defaultState, { type, payload } = { type: null, payload: {} }) {
  const state = { ...prevState };
  switch ( type ) {
    case UPDATE_INPUT_VALIDITY:
      const { formId, groupId, name, validity, validationMessage } = payload;
      if ( !( formId in state.forms ) ||
        !state.forms[ formId ].inputGroups ||
        !( groupId in state.forms[ formId ].inputGroups ) ) {
        return state;
      }
      const inputGroups = state.forms[ payload.formId ].inputGroups;
      if ( !( "inputs" in inputGroups[ groupId ] ) ) {
        inputGroups[ groupId ].inputs = {};
      }
      inputGroups[ groupId ].inputs[ name ] = {
        name,
        validity,
        validationMessage
      };
      return state;

    case UPDATE_PRISTINE:
      if ( !( payload.formId in state.forms ) ) {
        return state;
      }
      state.forms[ payload.formId ].pristine =  false;
      return state;

    case UPDATE_FORM_SUBMITTING:
      if ( !( payload.formId in state.forms ) ) {
        return state;
      }
      state.forms[ payload.formId ].submitting =  payload.submitting;
      return state;

    case UPDATE_FORM_SUBMITTED:
      if ( !( payload.formId in state.forms ) ) {
        return state;
      }
      state.forms[ payload.formId ].submitted = true;
      return state;

    case UPDATE_INPUT_GROUP_VALIDITY:
      if ( !( payload.formId in state.forms ) ) {
        return state;
      }
      if ( ! ( "inputGroups" in state.forms[ payload.formId ] ) ) {
        state.forms[ payload.formId ].inputGroups = {};
      }
      const iGroups = state.forms[ payload.formId ].inputGroups;
      iGroups[ payload.groupId ] = {
        id: payload.groupId,
        valid: payload.valid,
        errors: payload.errors
      };
      return state;

    case UPDATE_FORM_VALIDITY:
      const prev = payload.formId in state.forms
        ? state.forms[ payload.formId ] : {};
      state.forms[ payload.formId ] = {
        ...prev,
        id: payload.formId,
        valid: payload.valid,
        error: payload.error,
        pristine: true,
        submitting: false,
        submitted: false
      };
      return state;

    default:
      return state;
  }
}