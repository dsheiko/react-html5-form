import React from "react";
import { render } from "react-dom";
import debounce from "./debounce";
import { Form, InputGroup } from "Form";
import TextField from "@material-ui/core/TextField";
import Snackbar from "@material-ui/core/Snackbar";
import Button from "@material-ui/core/Button";

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

const MyForm = props => (

  <Form onSubmit={onSubmit} id="myform">
  {({ error, form }) => (
      <React.Fragment>
        <h2>Demo Form</h2>

        { error && (<Snackbar message={error} />) }

        <InputGroup
          validate={[ "email" ]}
          translate={{
            email: {
              valueMissing: "C'mon! We need some value"
            }
          }}>
        {({ error, valid }) => (

           <TextField
              error={!valid}
              label="Email"
              margin="normal"
              name="email"
              placeholder="Enter email"
              required
              helperText={ error ? error : "Group validates on submit event" }
            />


        )}
        </InputGroup>

        <InputGroup
          validate={{ "firstName" : ( input ) => {
            if ( !input.current.value.match( /^.{5,30}$/ ) ) {
              input.setCustomValidity( "Please enter a valid first name." );
              return false;
            }
            return true;
          }}}>
        {({ error, valid, inputGroup }) => (

           <TextField
              error={!valid}
              label="First Name"
              margin="normal"
              name="firstName"
              placeholder="Enter First Name"
              required
              onInput={( e ) => onInput( e, inputGroup, form ) }
              helperText={ error ? error : "Group validates as you are typing" }
            />

        )}
        </InputGroup>


        <Button variant="contained" color="primary" type="submit">
          Primary
        </Button>
      </React.Fragment>
    )}
  </Form>

);

render( <MyForm />, document.getElementById( "app" ) );