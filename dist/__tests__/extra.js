"use strict";

var _InputGroup = require("../Form/InputGroup");

describe("InputGroup", function () {

  it("returns null when no inputs", function () {
    var group = new _InputGroup.InputGroupComponent({});
    var res = group.getInputByName(null);
    expect(res).toEqual(null);
  });

  it("calls update only when state changes", function (done) {
    var group = new _InputGroup.InputGroupComponent({ onUpdate: function onUpdate(instance) {
        expect(instance).not.toBeNull();
        done();
      } });
    group.componentDidUpdate({}, { valid: false });
  });
});