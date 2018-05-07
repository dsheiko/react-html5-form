import React from "react";
import { render, Simulate, wait } from "react-testing-library";
import { Form, InputGroup } from "../Form";

const FIX_TEXT = "TEXT";

const getValidationMessage = ( inputGroup ) => {
   inputGroup.checkValidityAndUpdate();
   const input = inputGroup.getInputByName( "test" );
   return input.getValidationMessage();
};

const FixtureTestInput = ({ onMount }) => <Form>
      {() => (
      <InputGroup data-testid="inputGroup" validate={[ "test" ]} onMount={onMount}>
        { () => (
            <input name="test" />
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

const FixtureEmailFieldset = ({ error, valid, form }) => (
  <React.Fragment>
    { error && (<div data-testid="formError">{error}</div>)
    }
    <InputGroup
          tag="fieldset"
          validate={[ "email" ]}
          translate={{
        email: {
          valueMissing: "C'mon! We need some value"
        }
      }}>
    {({ error, valid }) => (

      <div className={`${!valid && "has-error"}`}>
        <input
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

    it("invokes onMount", () => {
        const onMount = ( form ) => {
          expect( form ).not.toBeNull();
        };
        const { getByTestId } = render(
            <Form data-testid="form" onMount={onMount}>
               { props => <FixtureSimpleFormContent {...props} /> }
            </Form>,
        );
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
    });

    describe("checkValidityAndUpdate", () => {
      it("does not break on call", () => {
        const onMount = ( form ) => {
          expect(() => form.checkValidityAndUpdate()).not.toThrow();
        };
        const { getByTestId } = render(
            <Form data-testid="form" onMount={onMount}>
               { props => <FixtureSimpleFormContent {...props} /> }
            </Form>,
        );
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


    it("accepts custom validator", () => {
        const onMount = ( inputGroup ) => {
          inputGroup.checkValidityAndUpdate();
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

    it("translate default validaiton messages", () => {
        const onMount = ( inputGroup ) => {
                expect( inputGroup.getValidationMessages() ).toEqual([ FIX_TEXT ]);
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

    it("invokes onMount prop", () => {
        const onMount = ( inputGroup ) => {
          expect(inputGroup).not.toBeNull();
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

    it("does not throw when el not found", () => {
        const onMount = ( inputGroup ) => {
          inputGroup.checkValidityAndUpdate();
          expect(() => inputGroup.getInputByName("email")).not.toThrow();
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
    it("contains HTML element", () => {
        const onMount = ( inputGroup ) => {
          const input = inputGroup.getInputByName( "email" );
          expect( input.current.value ).toEqual( FIX_TEXT );
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

    it( "throws when invalid property", () => {
        const onMount = ( inputGroup ) => {
             const input = inputGroup.getInputByName( "test" );
             expect( () => input.assignValidationMessage("foo", "bar") ).toThrowError();
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

    it( "returns unified message for valueMissing", () => {
        const onMount = ( inputGroup ) => {
          const input = inputGroup.getInputByName( "test" ),
                res = input.getValidationMessage({ valueMissing: true });
          expect( res ).toEqual( "Please fill out this field." );
        };
        const { queryByTestId } = render(
            <FixtureTestInput onMount={onMount} />
        );
    });

    it( "returns unified message for rangeOverflow", () => {
        const onMount = ( inputGroup ) => {
          const input = inputGroup.getInputByName( "test" );
          input.current.max = 100;
          const res = input.getValidationMessage({ rangeOverflow: true });
          expect( res ).toEqual( "Value must be less than or equal to 100." );
        };
        const { queryByTestId } = render(
            <FixtureTestInput onMount={onMount} />
        );
    });

    it( "returns unified message for rangeUnderflow", () => {
        const onMount = ( inputGroup ) => {
          const input = inputGroup.getInputByName( "test" );
          input.current.min = 100;
          const res = input.getValidationMessage({ rangeUnderflow: true });
          expect( res ).toEqual( "Value must be greater than or equal to 100." );
        };
        const { queryByTestId } = render(
            <FixtureTestInput onMount={onMount} />
        );
    });

    it( "returns unified message for tooLong", () => {
        const onMount = ( inputGroup ) => {
          const input = inputGroup.getInputByName( "test" );
          input.current.maxlength = 100;
          const res = input.getValidationMessage({ tooLong: true });
          expect( res ).toEqual( "Value must be less than 100 length." );
        };
        const { queryByTestId } = render(
            <FixtureTestInput onMount={onMount} />
        );
    });

    it( "returns unified message for tooShort", () => {
        const onMount = ( inputGroup ) => {
          const input = inputGroup.getInputByName( "test" );
          input.current.minlength = 100;
          const res = input.getValidationMessage({ tooShort: true });
          expect( res ).toEqual( "Value must be more than 100 length." );
        };
        const { queryByTestId } = render(
            <FixtureTestInput onMount={onMount} />
        );
    });

    it( "returns unified message for typeMismatch", () => {
        const onMount = ( inputGroup ) => {
          const input = inputGroup.getInputByName( "test" );
          input.current.type = "email";
          const res = input.getValidationMessage({ typeMismatch: true });
          expect( res ).toEqual( "Value is not a valid email." );
        };
        const { queryByTestId } = render(
            <FixtureTestInput onMount={onMount} />
        );
    });


    it( "returns translated value for rangeUnderflow", () => {
        const onMount = ( inputGroup ) => {
                expect( getValidationMessage( inputGroup ) ).toEqual( FIX_TEXT );
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