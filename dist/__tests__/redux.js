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
    });

    describe("updateInputGroupValidity", function () {
      it("returns expected payload", function () {
        var res = (0, _Actions.updateInputGroupValidity)(FIX_FORM_ID, FIX_GROUP_ID, true, []);
        expect(res.payload.formId).toEqual(FIX_FORM_ID);
      });
    });

    describe("updateFormValidity", function () {
      it("returns expected payload", function () {
        var res = (0, _Actions.updateFormValidity)(FIX_FORM_ID, FIX_GROUP_ID, true, "");
        expect(res.payload.formId).toEqual(FIX_FORM_ID);
      });
    });
  });
});