import React from "react";
import { render, Simulate, wait } from "react-testing-library";
import { Form, InputGroup } from "../Form";

const FIX_TEXT = "TEXT";

const getValidationMessage = ( inputGroup ) => {
   inputGroup.checkValidityAndUpdate();
   const input = inputGroup.getInputByName( "test" );
   return input.getValidationMessage();
};

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

  describe("getValidationMessage()", () => {

    it( "returns default value for rangeUnderflow", () => {
        const onMount = ( inputGroup ) => {
          expect( getValidationMessage( inputGroup ) ).toEqual( "Value must be greater than or equal to 100." );
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

     it( "returns default value for rangeOverflow", () => {
        const onMount = ( inputGroup ) => {
          expect( getValidationMessage( inputGroup ) ).toEqual( "Value must be less than or equal to 1." );
        };
        const { queryByTestId } = render(
            <Form>
              {() => (
              <InputGroup data-testid="inputGroup" validate={[ "test" ]} onMount={onMount}>
                {({ inputGroup }) => (
                    <input type="number" name="test" value="10" max="1" onChange={() => {}} />
                )}
              </InputGroup>
            )}
            </Form>
        );
    });

    it( "returns translated value for rangeUnderflow", () => {
        const onMount = ( inputGroup ) => {
          expect( getValidationMessage( inputGroup ) ).toEqual( FIX_TEXT );
        };
        const { queryByTestId } = render(
            <Form>
              {() => (
              <InputGroup data-testid="inputGroup" validate={[ "test" ]} translate={{
                  "test": {
                    rangeUnderflow: FIX_TEXT
                  }
                }} onMount={onMount}>
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