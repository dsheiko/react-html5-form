import React from "react";
import { render, Simulate, wait } from "react-testing-library";
import { Form, InputGroup } from "../Form";

const FIX_TEXT = "TEXT";

const onMountCheckValidity = ( form ) => {
  form.checkValidityAndUpdateInputGroups();
};

const getValidationMessage = ( inputGroup ) => {
   inputGroup.checkValidityAndUpdate();
   const input = inputGroup.getInputByName( "test" );
   return input.getValidationMessage();
};

const FixtureTestInput = ({ onMount }) => <Form>
      {() => (
      <InputGroup data-testid="inputGroup" validate={[ "test" ]} onMount={onMount}>
        { () => (
            <input name="test"  />
        )}
      </InputGroup>
    )}
    </Form>;

const FixtureSimpleFormContent = ({ error, valid, form }) => (
  <React.Fragment>
    <h2 data-testid="title">SimpleFormScope</h2>
    { error && (<div data-testid="error">{error}</div>)
    }
    <button data-testid="button" onClick={() => {
        form.setError( FIX_TEXT );
      }}>Submit</button>
  </React.Fragment>
);

const FixtureSimpleFormContentMs = ({ error, valid, form }) => (
  <React.Fragment>
    <h2 data-testid="title">SimpleFormScope</h2>
    { error && (<div data-testid="error">{error}</div>)
    }
    <button data-testid="button" onClick={() => {
        form.setError( FIX_TEXT, 10 );
      }}>Submit</button>
  </React.Fragment>
);

const FixtureEmailFieldset = ({ error, valid, form }) => (
  <React.Fragment>
    { error && (<div data-testid="formError">{error}</div>)
    }
    <InputGroup
          tag="fieldset"
          name="emailGroup"
          validate={[ "email" ]}
          translate={{
        email: {
          valueMissing: "C'mon! We need some value"
        }
      }}>
    {({ error, valid }) => (

      <div className={`${!valid && "has-error"}`}>
        <input
          data-testid="email"
          type="email"
          required
          name="email" />
        { error && (<div>
          <div data-testid="fieldError">{error}</div>
        </div>)  }
      </div>

    )}
    </InputGroup>
  </React.Fragment>
);

describe("<Form />", () => {
  describe("Component", () => {

    it("renders given children Nodes", () => {
        const { getByTestId } = render(
            <Form>
               { props => <FixtureSimpleFormContent {...props} /> }
            </Form>,
        );
        expect(getByTestId( "title" ).textContent).toBe( `SimpleFormScope` );
    });

    it("passes to generated FORM element arbitrary properties", () => {
        const { getByTestId } = render(
            <Form data-testid="form">
               { props => <FixtureSimpleFormContent {...props} /> }
            </Form>,
        );
        expect(getByTestId( "form" )).not.toBeNull();
    });

    it("invokes onMount", ( done ) => {
        const onMount = ( form ) => {
          expect( form ).not.toBeNull();
          done();
        };
        const { getByTestId } = render(
            <Form data-testid="form" onMount={onMount}>
               { props => <FixtureSimpleFormContent {...props} /> }
            </Form>,
        );
    });

    it("invokes onUpdate", ( done ) => {
        const onUpdate = ( form ) => {
          expect( form ).not.toBeNull();
          done();
        };
        render(<Form data-testid="form" onMount={onMountCheckValidity} onUpdate={onUpdate}>
            { () => (<InputGroup tag="fieldset" name="emailGroup" validate={[ "email" ]}>
            {() => ( <input type="email" required name="email" defaultValue="no-email" />  )}
            </InputGroup>) }
          </Form>);
    });

    it("validates on submit", () => {
        const { container, getByTestId } = render(
            <Form data-testid="form" onSubmit={( form ) => {
                expect( form.valid ).toEqual( false );
              }}>
               { props => <FixtureEmailFieldset {...props} /> }
            </Form>,
        );
        Simulate.submit(getByTestId( "form" ));
    });

    it("keeps pristine until first user interaction", ( done ) => {
        const onMount = ( form ) => {
          expect( form.state.pristine ).toEqual( true );
          done();
        };
        const { getByTestId } = render(
            <Form onMount={onMount}>
               { props => <FixtureEmailFieldset {...props} /> }
            </Form>,
        );
    });

    it("changes pristine with the first user interaction", ( done ) => {
        const onFormMount = ( form ) => {
          expect( form.state.pristine ).not.toEqual( true );
          done();
        };
        const onGroupMount = ( inputGroup ) => {
            inputGroup.setPristine();
        };
        const { getByTestId } = render(
            <Form onMount={onFormMount}>
               {() => (
                <InputGroup data-testid="inputGroup" validate={[ "test" ]} onMount={onGroupMount}>
                  { () => (
                      <input name="test"  />
                  )}
                </InputGroup>
              )}
            </Form>,
        );
    });

    it("changes pristine only once", ( done ) => {
        const onGroupMount = ( inputGroup ) => {
            inputGroup.setPristine();
            setTimeout(() => {
              inputGroup.setPristine();
              expect( inputGroup.state.pristine ).not.toEqual( true );
              done();
            }, 300 );
        };
        const { getByTestId } = render(
            <Form>
               {() => (
                <InputGroup data-testid="inputGroup" validate={[ "test" ]} onMount={onGroupMount}>
                  { () => (
                      <input name="test"  />
                  )}
                </InputGroup>
              )}
            </Form>,
        );
    });



    it("changes pristine from input", ( done ) => {
        const onFormMount = ( form ) => {
          expect( form.state.pristine ).not.toEqual( true );
          done();
        };
        const onGroupMount = ( inputGroup ) => {
          const input = inputGroup.getInputByName( "test" )
          input.setPristine();
        };
        const { getByTestId } = render(
            <Form onMount={onFormMount}>
               {() => (
                <InputGroup data-testid="inputGroup" validate={[ "test" ]} onMount={onGroupMount}>
                  { () => (
                      <input name="test"  />
                  )}
                </InputGroup>
              )}
            </Form>,
        );
    });

    it("keeps submitting false by default", ( done ) => {
        const onMount = ( form ) => {
          expect( form.state.submitting ).toEqual( false );
          done();
        };
        const { getByTestId } = render(
            <Form onMount={onMount}>
               { props => <FixtureEmailFieldset {...props} /> }
            </Form>,
        );
    });

    it("changes submitting while processing", ( done ) => {
        const onMount = ( form ) => {
          form.onSubmit();
        };
        const onSubmit = ( form ) => {
          expect( form.state.submitting ).toEqual( true );
          done();
        };
        const { getByTestId } = render(
            <Form data-testid="form" onSubmit={onSubmit} onMount={onMount}>
              { props =>  <InputGroup data-testid="inputGroup" validate={[ "test" ]}>
                { () => (
                    <input name="test"  />
                )}
              </InputGroup> }
            </Form>,
        );
    });


  });

  describe("API", () => {
    describe("setError", () => {
      it("changes form state", () => {
          const { container, getByTestId, queryByTestId } = render(
              <Form>
                 { props => <FixtureSimpleFormContent {...props} /> }
              </Form>,
          );
          expect(queryByTestId( "error" )).toBeNull();
          Simulate.click(getByTestId( "button" ));
          expect(getByTestId( "error" ).textContent).toBe( FIX_TEXT );
          expect(true).toEqual( true );
      });

      it("removes form error after given time", ( done ) => {
          const { container, getByTestId, queryByTestId } = render(
              <Form>
                 { props => <FixtureSimpleFormContentMs {...props} /> }
              </Form>,
          );
          expect(queryByTestId( "error" )).toBeNull();
          Simulate.click(getByTestId( "button" ));
          expect(getByTestId( "error" ).textContent).toBe( FIX_TEXT );
          setTimeout(() => {
            expect( queryByTestId( "error" ) ).toBe( null );
            done();
          }, 50 );
      });

    });

    describe("checkValidityAndUpdate", () => {
      it("does not break on call", ( done ) => {
        const onMount = ( form ) => {
          expect(() => form.checkValidityAndUpdate()).not.toThrow();
          done();
        };
        const { getByTestId } = render(
            <Form data-testid="form" onMount={onMount}>
               { props => <FixtureSimpleFormContent {...props} /> }
            </Form>,
        );
      });
    });

    describe("submit", () => {
      it("calls HTML element's submit", ( done ) => {
        const spy = jest.fn();
        const onMount = ( form ) => {
          form.getRef().current = { submit: spy };
          form.submit();
          expect( spy ).toHaveBeenCalledTimes( 1 );
          done();
        };
        const component = render(<Form data-testid="form" onMount={onMount}>
               { props => <FixtureSimpleFormContent {...props} /> }
            </Form>);
      });
    });


    describe("debugInputGroups", () => {
      it("get all groups", ( done ) => {
        const onUpdate = ( form ) => {
          const debug =  form.debugInputGroups();
          expect( debug[0].name ).toEqual( "emailGroup" );
          expect( debug[0].valid ).toEqual( false );
          done();
        };
        render(<Form data-testid="form" onMount={onMountCheckValidity} onUpdate={onUpdate}>
              { () => (<InputGroup tag="fieldset" name="emailGroup" validate={[ "email" ]}>
              {() => ( <input type="email" required name="email" defaultValue="no-email" />  )}
              </InputGroup>) }
            </Form>);
      });
      it("get group info by index", ( done ) => {
        const onUpdate = ( form ) => {
          const debug =  form.debugInputGroups( 0 );
          expect( debug.name ).toEqual( "emailGroup" );
          expect( debug.valid ).toEqual( false );
          done();
        };
        render(<Form data-testid="form" onMount={onMountCheckValidity} onUpdate={onUpdate}>
              { () => (<InputGroup tag="fieldset" name="emailGroup" validate={[ "email" ]}>
              {() => ( <input type="email" required name="email" defaultValue="no-email" />  )}
              </InputGroup>) }
            </Form>);
      });

      it("get group with no name", ( done ) => {
        const onUpdate = ( form ) => {
          const debug =  form.debugInputGroups( 0 );
          expect( debug.name ).toEqual( "undefined" );
          expect( debug.valid ).toEqual( false );
          done();
        };
        render(<Form data-testid="form" onMount={onMountCheckValidity} onUpdate={onUpdate}>
              { () => (<InputGroup tag="fieldset" validate={[ "email" ]}>
              {() => ( <input type="email" required name="email" defaultValue="no-email" />  )}
              </InputGroup>) }
            </Form>);
      });
    });

    describe("scrollIntoViewFirstInvalidInputGroup", () => {
      it("calls HTML element's scrollIntoView", ( done ) => {
        const spy = jest.fn();
        const onUpdate = ( form ) => {
          const group = form.getFirstInvalidInputGroup();
          group.getRef().current = { scrollIntoView: spy };
          form.scrollIntoViewFirstInvalidInputGroup();
          expect( spy ).toHaveBeenCalledTimes( 1 );
          done();
        };
        render(<Form data-testid="form" onMount={onMountCheckValidity} onUpdate={onUpdate}>
              { props => (<InputGroup tag="fieldset" name="emailGroup" validate={[ "email" ]}>
              {() => ( <input type="email" required name="email" defaultValue="no-email" />  )}
              </InputGroup>) }
            </Form>);
      });
    });




  });
});



describe("<InputGroup />", () => {
  describe("Component", () => {

    it("passes to generated element arbitrary properties", () => {
        const { queryByTestId } = render(
            <Form>
              {({ error, valid }) => (
              <InputGroup data-testid="inputGroup" validate={[ "email" ]}>
                {({ error, valid }) => (
                    <input type="email" required name="email" />
                )}
              </InputGroup>
            )}
            </Form>,
        );
        expect(queryByTestId( "inputGroup" )).not.toBeNull();
    });


    it("generates ids", () => {
        const { getByTestId } = render(
            <FixtureTestInput onMount={() => { }} />,
        );
        const actual = getByTestId( "inputGroup" ).id;
        expect( actual.startsWith( "__igroup" ) ).toBe( true );
    });

    it("does not generates ids when specified", () => {
        const { getByTestId } = render(
          <Form>
            {() => (
            <InputGroup id="myid" data-testid="inputGroup" validate={[ "test" ]}>
              { () => (
                  <input name="test"  />
              )}
            </InputGroup>
          )}
          </Form>,
        );
        const actual = getByTestId( "inputGroup" ).id;
        expect( actual ).toEqual( "myid" );
    });



    it("accepts custom validator", ( done ) => {
        const onMount = ( inputGroup ) => {
          inputGroup.checkValidityAndUpdate();
          done();
        };
        const { queryByTestId } = render(
            <Form>
              {({ error, valid }) => (
              <InputGroup data-testid="inputGroup" validate={{ "email": ( input ) => {
                  expect( input.current.value ).toEqual( "foo" );
              }}} onMount={onMount}>
                {({ error, valid }) => (
                    <input  name="email" defaultValue="foo" />
                )}
              </InputGroup>
            )}
            </Form>,
        );
        expect(queryByTestId( "inputGroup" )).not.toBeNull();
    });

    it("translate default validaiton messages", ( done ) => {
        const onMount = ( inputGroup ) => {
                expect( inputGroup.getValidationMessages() ).toEqual([ FIX_TEXT ]);
                done();
              },
              translate = { email: { valueMissing: FIX_TEXT } };
        const { queryByTestId } = render(
            <Form>
              {({ error, valid }) => (
              <InputGroup data-testid="inputGroup" validate={["email"]}
              translate={translate}
              onMount={onMount}>
                {({ error, valid }) => (
                    <input type="email" required name="email" />
                )}
              </InputGroup>
            )}
            </Form>,
        );
    });


    it("invokes onMount prop", ( done ) => {
        const onMount = ( inputGroup ) => {
          expect( inputGroup ).not.toBeNull();
          done();
        };
        const { queryByTestId } = render(
            <Form>
              {() => (
              <InputGroup data-testid="inputGroup" validate={[ "email" ]} onMount={onMount}>
                {({ inputGroup }) => (
                    <input type="email" required name="email" />
                )}
              </InputGroup>
            )}
            </Form>,
        );
    });


    it("invokes onMount prop", ( done ) => {
        const onMount = ( inputGroup ) => {
          expect( inputGroup ).not.toBeNull();
          done();
        };
        const { queryByTestId } = render(
            <Form>
              {() => (
              <InputGroup data-testid="inputGroup" validate={[ "email" ]} onMount={onMount}>
                {({ inputGroup }) => (
                    <input type="email" required name="email" />
                )}
              </InputGroup>
            )}
            </Form>,
        );
    });

    it("updates state for a valid form", ( done ) => {
        const onMount = ( form ) => {
          const res = form.checkValidityAndUpdateInputGroups();
          expect( res ).toEqual( true );
          done();
        };
        const { getByTestId } = render(<Form data-testid="form" onMount={onMount}>
              { () => (<InputGroup tag="fieldset" validate={[ "email" ]}>
              {() => ( <input data-testid="input" name="email"  />  )}
              </InputGroup>) }
            </Form>);
      });

    it("does not throw when el not found", ( done ) => {
        const onMount = ( inputGroup ) => {
          inputGroup.checkValidityAndUpdate();
          expect(() => inputGroup.getInputByName("email")).not.toThrow();
          done();
        };
        const { queryByTestId } = render(
            <Form>
              {() => (
              <InputGroup data-testid="inputGroup" validate={[ "foo" ]} onMount={onMount}>
                {({ error }) => (
                    <input name="email" />
                )}
              </InputGroup>
            )}
            </Form>,
        );
    });

  });

});


describe("Input", () => {
  describe("current", () => {
    it("contains HTML element", ( done ) => {
        const onMount = ( inputGroup ) => {
          const input = inputGroup.getInputByName( "email" );
          expect( input.current.value ).toEqual( FIX_TEXT );
          done();
        };
        const { queryByTestId } = render(
            <Form>
              {() => (
              <InputGroup data-testid="inputGroup" validate={[ "email" ]} onMount={onMount}>
                {({ inputGroup }) => (
                    <input type="email" required name="email" value={FIX_TEXT} onChange={() => {}} />
                )}
              </InputGroup>
            )}
            </Form>,
        );
        expect(queryByTestId( "inputGroup" )).not.toBeNull();
    });
  });

  describe("assignValidationMessage()", () => {

    it( "throws when invalid property", ( done ) => {
        const onMount = ( inputGroup ) => {
             const input = inputGroup.getInputByName( "test" );
             expect( () => input.assignValidationMessage("foo", "bar") ).toThrowError();
             done();
        };
        const { queryByTestId } = render(
            <Form>
              {() => (
              <InputGroup data-testid="inputGroup" validate={[ "test" ]} onMount={onMount}>
                {({ inputGroup }) => (
                    <input type="number" name="test" value="10" min="100" onChange={() => {}} />
                )}
              </InputGroup>
            )}
            </Form>
        );
    });
  });

  describe("getValidationMessage()", () => {

    it( "returns unified message for valueMissing", ( done ) => {
        const onMount = ( inputGroup ) => {
          const input = inputGroup.getInputByName( "test" ),
                res = input.getValidationMessage({ valueMissing: true });
          expect( res ).toEqual( "Please fill out this field." );
          done();
        };
        const { queryByTestId } = render(
            <FixtureTestInput onMount={onMount} />
        );
    });

    it( "returns unified message for rangeOverflow", ( done ) => {
        const onMount = ( inputGroup ) => {
          const input = inputGroup.getInputByName( "test" );
          input.current.max = 100;
          const res = input.getValidationMessage({ rangeOverflow: true });
          expect( res ).toEqual( "Value must be less than or equal to 100." );
          done();
        };
        const { queryByTestId } = render(
            <FixtureTestInput onMount={onMount} />
        );
    });

    it( "returns unified message for rangeUnderflow", ( done ) => {
        const onMount = ( inputGroup ) => {
          const input = inputGroup.getInputByName( "test" );
          input.current.min = 100;
          const res = input.getValidationMessage({ rangeUnderflow: true });
          expect( res ).toEqual( "Value must be greater than or equal to 100." );
          done();
        };
        const { queryByTestId } = render(
            <FixtureTestInput onMount={onMount} />
        );
    });

    it( "returns unified message for tooLong", ( done ) => {
        const onMount = ( inputGroup ) => {
          const input = inputGroup.getInputByName( "test" );
          input.current.maxlength = 100;
          const res = input.getValidationMessage({ tooLong: true });
          expect( res ).toEqual( "Value must be less than 100 length." );
          done();
        };
        const { queryByTestId } = render(
            <FixtureTestInput onMount={onMount} />
        );
    });

    it( "returns unified message for tooShort", ( done ) => {
        const onMount = ( inputGroup ) => {
          const input = inputGroup.getInputByName( "test" );
          input.current.minlength = 100;
          const res = input.getValidationMessage({ tooShort: true });
          expect( res ).toEqual( "Value must be more than 100 length." );
          done();
        };
        const { queryByTestId } = render(
            <FixtureTestInput onMount={onMount} />
        );
    });

    it( "returns unified message for typeMismatch", ( done ) => {
        const onMount = ( inputGroup ) => {
          const input = inputGroup.getInputByName( "test" );
          input.current.type = "email";
          const res = input.getValidationMessage({ typeMismatch: true });
          expect( res ).toEqual( "Value is not a valid email." );
          done();
        };
        const { queryByTestId } = render(
            <FixtureTestInput onMount={onMount} />
        );
    });


    it( "returns translated value for rangeUnderflow", ( done ) => {
        const onMount = ( inputGroup ) => {
                expect( getValidationMessage( inputGroup ) ).toEqual( FIX_TEXT );
                done();
              },
              translate = {
                "test": {
                  rangeUnderflow: FIX_TEXT
                }
              };
        const { queryByTestId } = render(
            <Form>
              {() => (
              <InputGroup data-testid="inputGroup" validate={[ "test" ]} translate={translate} onMount={onMount}>
                {({ inputGroup }) => (
                    <input type="number" name="test" value="10" min="100" onChange={() => {}} />
                )}
              </InputGroup>
            )}
            </Form>
        );
    });




  });
});