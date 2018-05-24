import { UPDATE_INPUT_VALIDITY,
         DEFAULT_VALIDITY,
         UPDATE_INPUT_GROUP_VALIDITY,
         UPDATE_FORM_VALIDITY } from "../Constants";

const defaultState = {
  forms: {}
};

export function html5form( prevState = defaultState, { type, payload } ) {
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
        error: payload.error
      };
      return state;

    default:
      return state;
  }
}