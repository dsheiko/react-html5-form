import { html5form } from "../Form";
import { UPDATE_FORM_VALIDITY, UPDATE_INPUT_GROUP_VALIDITY, UPDATE_INPUT_VALIDITY } from "../Redux/Constants";
import { updateInputValidity, updateInputGroupValidity, updateFormValidity } from "../Redux/Actions";

const FIX_FORM_ID = "myForm",
      FIX_GROUP_ID = "myGroup",
      FIX_NAME = "myName";

let defaultState = {
  forms: {}
};

describe( "Redux", () => {

  describe( "html5form reducer", () => {

    beforeEach(() => {
      defaultState = {
        forms: {}
      };
    });

    it( "default state", () => {

      const state = html5form( defaultState, {
        type: "NONEXISITNG",
        payload: {}
      });
      expect( defaultState ).toEqual( defaultState );

    });

    it( "registers form", () => {

      const state = html5form( defaultState, {
        type: UPDATE_FORM_VALIDITY,
        payload: {
          formId: FIX_FORM_ID,
          valid: true,
          error: ""
        }
      });
      expect( Object.keys( state.forms ).length ).toEqual( 1 );
      expect( state.forms[ FIX_FORM_ID ].id ).toEqual( FIX_FORM_ID );

    });

    it( "updates form", () => {

      const prevState = html5form( defaultState, {
        type: UPDATE_FORM_VALIDITY,
        payload: {
          formId: FIX_FORM_ID,
          valid: true,
          error: ""
        }
      });

      const nextState = html5form( prevState, {
        type: UPDATE_FORM_VALIDITY,
        payload: {
          formId: FIX_FORM_ID,
          valid: false,
          error: ""
        }
      });

      expect( Object.keys( nextState.forms ).length ).toEqual( 1 );
      expect( nextState.forms[ FIX_FORM_ID ].valid ).toEqual( false );

    });


    it( "registers inputGroup", () => {

      const prevState = html5form( defaultState, {
        type: UPDATE_FORM_VALIDITY,
        payload: {
          formId: FIX_FORM_ID,
          valid: true,
          error: ""
        }
      });

      const nextState = html5form( prevState, {
        type: UPDATE_INPUT_GROUP_VALIDITY,
        payload: {
          formId: FIX_FORM_ID,
          groupId: FIX_GROUP_ID,
          valid: true,
          errors: []
        }
      });

      const inputGroups = nextState.forms[ FIX_FORM_ID ].inputGroups;
      expect( Object.keys( inputGroups ).length ).toEqual( 1 );
      expect( inputGroups[ FIX_GROUP_ID ].id ).toEqual( FIX_GROUP_ID );

    });



    it( "registers input", () => {

      const prevState = html5form( defaultState, {
        type: UPDATE_FORM_VALIDITY,
        payload: {
          formId: FIX_FORM_ID,
          valid: true,
          error: ""
        }
      });

      const middleState = html5form( prevState, {
        type: UPDATE_INPUT_GROUP_VALIDITY,
        payload: {
          formId: FIX_FORM_ID,
          groupId: FIX_GROUP_ID,
          valid: true,
          errors: []
        }
      });

      const nextState = html5form( middleState, {
        type: UPDATE_INPUT_VALIDITY,
        payload: {
          formId: FIX_FORM_ID,
          groupId: FIX_GROUP_ID,
          name: FIX_NAME,
          validity: {},
          validationMessage: ""
        }
      });

      const inputs = nextState.forms[ FIX_FORM_ID ].inputGroups[ FIX_GROUP_ID ].inputs;
      expect( Object.keys( inputs ).length ).toEqual( 1 );
      expect( inputs[ FIX_NAME ].name ).toEqual( FIX_NAME );

    });

    it( "registers input out of form", () => {
      const nextState = html5form( defaultState, {
        type: UPDATE_INPUT_VALIDITY,
        payload: {
          formId: FIX_FORM_ID,
          groupId: FIX_GROUP_ID,
          name: FIX_NAME,
          validity: {},
          validationMessage: ""
        }
      });

      expect( nextState ).toEqual( defaultState );

    });

    it( "registers input out of group", () => {

      const prevState = html5form( defaultState, {
        type: UPDATE_FORM_VALIDITY,
        payload: {
          formId: FIX_FORM_ID,
          valid: true,
          error: ""
        }
      });

      const nextState = html5form( prevState, {
        type: UPDATE_INPUT_VALIDITY,
        payload: {
          formId: FIX_FORM_ID,
          groupId: FIX_GROUP_ID,
          name: FIX_NAME,
          validity: {},
          validationMessage: ""
        }
      });

      expect( nextState ).toEqual( prevState );

    });

    it( "registers group out of form", () => {

      const nextState = html5form( defaultState, {
        type: UPDATE_INPUT_GROUP_VALIDITY,
        payload: {
          formId: FIX_FORM_ID,
          groupId: FIX_GROUP_ID,
          valid: true,
          errors: []
        }
      });
      expect( nextState ).toEqual( defaultState );

    });


  });

  describe( "Actions", () => {

    describe( "updateInputValidity", () => {
      it( "returns expected payload", () => {
        const res = updateInputValidity( FIX_FORM_ID, FIX_GROUP_ID, FIX_NAME, {}, "" );
        expect( res.payload.formId ).toEqual( FIX_FORM_ID );
      });
    });

    describe( "updateInputGroupValidity", () => {
      it( "returns expected payload", () => {
        const res = updateInputGroupValidity( FIX_FORM_ID, FIX_GROUP_ID, true, [] );
        expect( res.payload.formId ).toEqual( FIX_FORM_ID );
      });
    });

    describe( "updateFormValidity", () => {
      it( "returns expected payload", () => {
        const res = updateFormValidity( FIX_FORM_ID, FIX_GROUP_ID, true, "" );
        expect( res.payload.formId ).toEqual( FIX_FORM_ID );
      });
    });

  });
});