"use strict";

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _Form = require("../Form");

var _Constants = require("../Redux/Constants");

var _Actions = require("../Redux/Actions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FIX_FORM_ID = "myForm",
    FIX_GROUP_ID = "myGroup",
    FIX_NAME = "myName";

var defaultState = {
  forms: {}
};

describe("Redux", function () {

  describe("html5form reducer", function () {

    beforeEach(function () {
      defaultState = {
        forms: {}
      };
    });

    it("default state", function () {
      var state = (0, _Form.html5form)();
      expect(defaultState).toEqual(defaultState);
    });

    it("handling nonexisting action", function () {

      var state = (0, _Form.html5form)(defaultState, {
        type: "NONEXISITNG",
        payload: {}
      });
      expect(defaultState).toEqual(defaultState);
    });

    it("registers form", function () {

      var state = (0, _Form.html5form)(defaultState, {
        type: _Constants.UPDATE_FORM_VALIDITY,
        payload: {
          formId: FIX_FORM_ID,
          valid: true,
          error: ""
        }
      });
      expect((0, _keys2.default)(state.forms).length).toEqual(1);
      expect(state.forms[FIX_FORM_ID].id).toEqual(FIX_FORM_ID);
    });

    it("updates form", function () {

      var prevState = (0, _Form.html5form)(defaultState, {
        type: _Constants.UPDATE_FORM_VALIDITY,
        payload: {
          formId: FIX_FORM_ID,
          valid: true,
          error: ""
        }
      });

      var nextState = (0, _Form.html5form)(prevState, {
        type: _Constants.UPDATE_FORM_VALIDITY,
        payload: {
          formId: FIX_FORM_ID,
          valid: false,
          error: ""
        }
      });

      expect((0, _keys2.default)(nextState.forms).length).toEqual(1);
      expect(nextState.forms[FIX_FORM_ID].valid).toEqual(false);
    });

    it("updates pristine", function () {

      var prevState = (0, _Form.html5form)(defaultState, {
        type: _Constants.UPDATE_FORM_VALIDITY,
        payload: {
          formId: FIX_FORM_ID,
          valid: true,
          error: ""
        }
      });

      var nextState = (0, _Form.html5form)(prevState, {
        type: _Constants.UPDATE_PRISTINE,
        payload: {
          formId: FIX_FORM_ID
        }
      });

      expect(nextState.forms[FIX_FORM_ID].pristine).toEqual(false);
    });

    it("updates pristine for non existing form", function () {

      var prevState = (0, _Form.html5form)(defaultState, {
        type: _Constants.UPDATE_FORM_VALIDITY,
        payload: {
          formId: FIX_FORM_ID,
          valid: true,
          error: ""
        }
      });

      var nextState = (0, _Form.html5form)(prevState, {
        type: _Constants.UPDATE_PRISTINE,
        payload: {
          formId: "NONEXISITNG"
        }
      });

      expect(nextState.forms[FIX_FORM_ID].pristine).toEqual(true);
    });

    it("updates submitting", function () {

      var prevState = (0, _Form.html5form)(defaultState, {
        type: _Constants.UPDATE_FORM_VALIDITY,
        payload: {
          formId: FIX_FORM_ID,
          valid: true,
          error: ""
        }
      });

      var nextState = (0, _Form.html5form)(prevState, {
        type: _Constants.UPDATE_FORM_SUBMITTING,
        payload: {
          formId: FIX_FORM_ID,
          submitting: true
        }
      });

      expect(nextState.forms[FIX_FORM_ID].submitting).toEqual(true);
    });

    it("updates submitted", function () {

      var prevState = (0, _Form.html5form)(defaultState, {
        type: _Constants.UPDATE_FORM_VALIDITY,
        payload: {
          formId: FIX_FORM_ID,
          valid: true,
          error: ""
        }
      });

      var nextState = (0, _Form.html5form)(prevState, {
        type: _Constants.UPDATE_FORM_SUBMITTED,
        payload: {
          formId: FIX_FORM_ID
        }
      });

      expect(nextState.forms[FIX_FORM_ID].submitted).toEqual(true);
    });

    it("updates submitting for non-existing form", function () {

      var prevState = (0, _Form.html5form)(defaultState, {
        type: _Constants.UPDATE_FORM_VALIDITY,
        payload: {
          formId: FIX_FORM_ID,
          valid: true,
          error: ""
        }
      });

      var nextState = (0, _Form.html5form)(prevState, {
        type: _Constants.UPDATE_FORM_SUBMITTING,
        payload: {
          formId: "NONEXISITNG",
          submitting: true
        }
      });

      expect(nextState.forms[FIX_FORM_ID].submitting).toEqual(false);
    });

    it("registers inputGroup", function () {

      var prevState = (0, _Form.html5form)(defaultState, {
        type: _Constants.UPDATE_FORM_VALIDITY,
        payload: {
          formId: FIX_FORM_ID,
          valid: true,
          error: ""
        }
      });

      var nextState = (0, _Form.html5form)(prevState, {
        type: _Constants.UPDATE_INPUT_GROUP_VALIDITY,
        payload: {
          formId: FIX_FORM_ID,
          groupId: FIX_GROUP_ID,
          valid: true,
          errors: []
        }
      });

      var inputGroups = nextState.forms[FIX_FORM_ID].inputGroups;
      expect((0, _keys2.default)(inputGroups).length).toEqual(1);
      expect(inputGroups[FIX_GROUP_ID].id).toEqual(FIX_GROUP_ID);
    });

    it("registers input", function () {

      var prevState = (0, _Form.html5form)(defaultState, {
        type: _Constants.UPDATE_FORM_VALIDITY,
        payload: {
          formId: FIX_FORM_ID,
          valid: true,
          error: ""
        }
      });

      var middleState = (0, _Form.html5form)(prevState, {
        type: _Constants.UPDATE_INPUT_GROUP_VALIDITY,
        payload: {
          formId: FIX_FORM_ID,
          groupId: FIX_GROUP_ID,
          valid: true,
          errors: []
        }
      });

      var nextState = (0, _Form.html5form)(middleState, {
        type: _Constants.UPDATE_INPUT_VALIDITY,
        payload: {
          formId: FIX_FORM_ID,
          groupId: FIX_GROUP_ID,
          name: FIX_NAME,
          validity: {},
          validationMessage: ""
        }
      });

      var inputs = nextState.forms[FIX_FORM_ID].inputGroups[FIX_GROUP_ID].inputs;
      expect((0, _keys2.default)(inputs).length).toEqual(1);
      expect(inputs[FIX_NAME].name).toEqual(FIX_NAME);
    });

    it("registers input out of form", function () {
      var nextState = (0, _Form.html5form)(defaultState, {
        type: _Constants.UPDATE_INPUT_VALIDITY,
        payload: {
          formId: FIX_FORM_ID,
          groupId: FIX_GROUP_ID,
          name: FIX_NAME,
          validity: {},
          validationMessage: ""
        }
      });

      expect(nextState).toEqual(defaultState);
    });

    it("registers input out of group", function () {

      var prevState = (0, _Form.html5form)(defaultState, {
        type: _Constants.UPDATE_FORM_VALIDITY,
        payload: {
          formId: FIX_FORM_ID,
          valid: true,
          error: ""
        }
      });

      var nextState = (0, _Form.html5form)(prevState, {
        type: _Constants.UPDATE_INPUT_VALIDITY,
        payload: {
          formId: FIX_FORM_ID,
          groupId: FIX_GROUP_ID,
          name: FIX_NAME,
          validity: {},
          validationMessage: ""
        }
      });

      expect(nextState).toEqual(prevState);
    });

    it("registers group out of form", function () {

      var nextState = (0, _Form.html5form)(defaultState, {
        type: _Constants.UPDATE_INPUT_GROUP_VALIDITY,
        payload: {
          formId: FIX_FORM_ID,
          groupId: FIX_GROUP_ID,
          valid: true,
          errors: []
        }
      });
      expect(nextState).toEqual(defaultState);
    });
  });

  describe("Actions", function () {

    describe("updateInputValidity", function () {
      it("returns expected payload", function () {
        var res = (0, _Actions.updateInputValidity)(FIX_FORM_ID, FIX_GROUP_ID, FIX_NAME, {}, "");
        expect(res.payload.formId).toEqual(FIX_FORM_ID);
      });
      it("does not fail without parameters", function () {
        var res = (0, _Actions.updateInputValidity)();
        expect(res.payload.formId).toEqual("");
      });
    });

    describe("updateInputGroupValidity", function () {
      it("returns expected payload", function () {
        var res = (0, _Actions.updateInputGroupValidity)(FIX_FORM_ID, FIX_GROUP_ID, true, []);
        expect(res.payload.formId).toEqual(FIX_FORM_ID);
      });
      it("does not fail without parameters", function () {
        var res = (0, _Actions.updateInputGroupValidity)();
        expect(res.payload.formId).toEqual("");
      });
    });

    describe("updateFormValidity", function () {
      it("returns expected payload", function () {
        var res = (0, _Actions.updateFormValidity)(FIX_FORM_ID, FIX_GROUP_ID, true, "");
        expect(res.payload.formId).toEqual(FIX_FORM_ID);
      });
      it("does not fail without parameters", function () {
        var res = (0, _Actions.updateFormValidity)();
        expect(res.payload.formId).toEqual("");
      });
    });

    describe("updatePristine", function () {
      it("returns expected payload", function () {
        var res = (0, _Actions.updatePristine)(FIX_FORM_ID, FIX_GROUP_ID);
        expect(res.payload.formId).toEqual(FIX_FORM_ID);
      });
      it("does not fail without parameters", function () {
        var res = (0, _Actions.updatePristine)();
        expect(res.payload.formId).toEqual("");
      });
    });

    describe("updateSubmitting", function () {
      it("returns expected payload", function () {
        var res = (0, _Actions.updateSubmitting)(FIX_FORM_ID, true);
        expect(res.payload.formId).toEqual(FIX_FORM_ID);
      });
      it("does not fail without parameters", function () {
        var res = (0, _Actions.updateSubmitting)();
        expect(res.payload.formId).toEqual("");
      });
    });

    describe("updateSubmitted", function () {
      it("returns expected payload", function () {
        var res = (0, _Actions.updateSubmitted)(FIX_FORM_ID);
        expect(res.payload.formId).toEqual(FIX_FORM_ID);
      });
      it("does not fail without parameters", function () {
        var res = (0, _Actions.updateSubmitted)();
        expect(res.payload.formId).toEqual("");
      });
    });
  });
});