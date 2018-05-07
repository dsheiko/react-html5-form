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
const onInput = debounce(( e, inputGroup, form ) => {
  // Update state only of input group in focus
  inputGroup.checkValidityAndUpdate();
  // Update "valid" property of the form
  form.checkValidityAndUpdate();
}, 50 );

const onShowErrors = ( e, form ) => {
  e.preventDefault();
  form.checkValidityAndUpdateInputGroups();
};

const validateDateTime = ( input ) => {
  if ( input.current.value === "Choose..." ) {
      input.setCustomValidity( `Please select ${input.current.title}` );
      return false;
  }
  return true;
};

const MyForm = props => (
  <Form onSubmit={onSubmit} id="myform">
  {({ error, valid, form }) => (
      <React.Fragment>
        <h2>Demo Form</h2>

        <p>Form validity: &nbsp;
        { valid
          ? <span className="text-success">valid</span>
          : <span className="text-danger">at least one input in invalid state</span> }&nbsp;
        <button className="btn btn-info btn-sm" onClick={( e ) => onShowErrors( e, form ) }>update input groups</button>
        </p>

        { error && (<div className="alert alert-danger" role="alert">
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

          <div className="form-group">
          <label id="emailLabel" htmlFor="emailInput">Email address</label>
            <input
              type="email"
              required
              name="email"
              aria-labelledby="emailLabel"
              className={`form-control ${!valid && "is-invalid"}`}
              id="emailInput"
              aria-describedby="emailHelp"
              placeholder="Enter email" />

              { error && (<div className="invalid-feedback">{error}</div>)  }

              <small className="form-text text-muted">
                Group validates on submit event
              </small>

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
        {({ error, valid, inputGroup }) => (
          <div className="form-group">
            <label id="firstNameLabel" htmlFor="firstNameInput">First Name</label>
            <input
              pattern="^.{5,30}$"
              required
              className={`form-control ${!valid && "is-invalid"}`}
              id="firstNameInput"
              aria-labelledby="firstNameLabel"
              name="firstName"
              onInput={( e ) => onInput( e, inputGroup, form ) }
              placeholder="Enter first name"/>

            { error && (<div className="invalid-feedback">{error}</div>)  }

            <small className="form-text text-muted">
                Group validates as you are typing
            </small>



          </div>
        )}
        </InputGroup>

        <InputGroup validate={{
          "vatId": ( input ) => {
            if ( !input.current.value.startsWith( "DE" ) ) {
              input.setCustomValidity( "Code must start with DE." );
              return false;
            }
            return true;
          }
        }}>
        {({ error, valid }) => (
          <div className="form-group">
            <label id="vatIdLabel" htmlFor="vatIdInput">VAT Number (optional)</label>
            <input
              className={`form-control ${!valid && "is-invalid"}`}
              id="vatIdInput"
              aria-labelledby="vatIdLabel"
              name="vatId"
              placeholder="Enter VAT Number"/>

            { error && (<div className="invalid-feedback">{error}</div>)  }

          <small className="form-text text-muted">
                Group validates on submit event
            </small>

          </div>
        )}
        </InputGroup>

        <InputGroup validate={{ "day": validateDateTime, "month": validateDateTime }}>
        {({ errors, valid }) => (
          <div className="form-group">

          <div className="form-row">
            <div className="form-group col-md-6">
               <label htmlFor="selectDay">Day</label>
               <select name="day" id="selectDay" title="Day" className={`form-control ${!valid && "is-invalid"}`}>
                  <option>Choose...</option>
                  <option>...</option>
               </select>
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="selectMonth">Month</label>
              <select name="month" id="selectMonth"  title="Month" className={`form-control ${!valid && "is-invalid"}`}>
                  <option>Choose...</option>
                  <option>...</option>
              </select>
            </div>
          </div>

          { errors.map( ( error, key ) => ( <div key={key} className="alert alert-danger">{error}</div> )) }

          <small className="form-text text-muted">
              Group validates on submit event
          </small>

          </div>
        )}
        </InputGroup>

        <button className="btn btn-primary" type="submit">Submit</button>
      </React.Fragment>
    )}
  </Form>
);

render( <MyForm />, document.getElementById( "app" ) );