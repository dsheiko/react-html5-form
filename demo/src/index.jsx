import React from "react";
import { render } from "react-dom";
import debounce from "./debounce";
import { Form, InputGroup } from "Form";

async function onSubmit( form ) {
  // let's pretend we have a server error
  form.setError("Opps, a server error");
  return Promise.resolve();
};

// Debounce for 50ms
const onInput = debounce(( e, inputGroup ) => {
  inputGroup.checkValidityAndUpdate();
}, 50 );

const MyForm = props => (
  <Form onSubmit={onSubmit} id="myform">
  {({ error, valid }) => (
      <React.Fragment>
        <h1>Demo Form</h1>

        { !valid && (<div className="alert alert-danger" role="alert">
            <strong>Oh snap!</strong> {error}
          </div>)
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

          <div className={`form-group ${!valid && "has-danger"}`}>
            <label id="emailLabel" htmlFor="emailInput">Email address</label>
            <input
              type="email"
              required
              name="email"
              aria-labelledby="emailLabel"
              className="form-control"
              id="emailInput"
              aria-describedby="emailHelp"
              placeholder="Enter email" />

            { error && (<div>
              <div className="form-control-feedback">{error}</div>
            </div>)  }
          </div>

        )}
        </InputGroup>

        <InputGroup
          validate={[ "firstName" ]}
          translate={{
            firstName: {
              patternMismatch: "Please enter a valid first name."
            }
          }}>
        {({ errors, valid, inputGroup }) => (
          <div className={`form-group ${!valid && "has-danger"}`}>
            <label id="firstNameLabel" htmlFor="firstNameInput">First Name</label>
            <input
              pattern="^.{5,30}$"
              required
              className="form-control"
              id="firstNameInput"
              aria-labelledby="firstNameLabel"
              name="firstName"
              onInput={( e ) => onInput( e, inputGroup ) }
              placeholder="Enter first name"/>

            { errors.map( ( error, key ) => ( <div key={key} className="form-control-feedback">{error}</div> )) }

          </div>
        )}
        </InputGroup>

        <InputGroup validate={{
          "vatId": ( input ) => {
            if ( !input.current.value.startsWith( "DE" ) ) {
              input.setCustomValidity( "Code must start with DE" );
              return false;
            }
            return true;
          }
        }}>
        {({ error, valid }) => (
          <div className={`form-group ${!valid && "has-danger"}`}>
            <label id="vatIdLabel" htmlFor="vatIdInput">VAT Number (optional)</label>
            <input
              className="form-control"
              id="vatIdInput"
              aria-labelledby="vatIdLabel"
              name="vatId"
              placeholder="Enter VAT Number"/>

            { error && (<div>
              <div className="form-control-feedback">{error}</div>
            </div>)  }

          </div>
        )}
        </InputGroup>

        <button  className="btn btn-primary" type="submit">Submit</button>
      </React.Fragment>
    )}
  </Form>
);

render( <MyForm />, document.getElementById( "app" ) );