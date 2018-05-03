# React-html5-form

Form component that that takes full advantage of HTML5 Form Validation API (https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation)
So you:
- can use arbitrary input controls (HTML or components)
- get control over markup constraints
- can customize standard validation messages
- can assign custom validators
- can toggle input group scope message
- can toggle form scope message
- can subscribe for input event and run input group validation


## Installation

```bash
npm i react-html5-form
```

## Demo
```bash
cd ./demo
```

## <Form>

Represents form

### Props
- <Function> `onSubmit` - form submit handler
- all the attributes of Form HTML element

### API
- `scrollIntoViewFirstInvalidInputGroup()` - scroll first input group in invalid state into view (happens automatically onSubmit)
- `checkValidity()` - returns boolean truthy when all the registered input groups in valid state
- `setError( message = "")` - set form scope error message

### Scope parameters
- <String> `error` - error message set with `setError()`
- <Boolean> `valid` - form validity state
- <React.Component> `form` - link to the component API

#### Defining component
```jsx
import React from "react";
import { render } from "react-dom";
import { Form } from "Form";

const MyForm = props => (
  <Form id="myform">
  {({ error, valid }) => (
      <>
      Form content
      </>
    )}
  </Form>
);

render( <MyForm />, document.getElementById( "app" ) );
```
`<Form>` creates `<form noValidate ..>` wrapper for passed in children. It delegates properties to the produced HTML Element.
For example specified `id` ends up in the generated form.


#### Accessing `Form` API
```jsx

async function onSubmit( form ) {
  form.setError("Opps, a server error");
  return Promise.resolve();
};

const MyForm = props => (
  <Form onSubmit={onSubmit} id="myform">
  {({ error, valid, form }) => (
      <>
      { !valid && (<div className="alert alert-danger" role="alert">
            <strong>Oh snap!</strong> {error}
          </div>)
      }
      Form content
      </>
    )}
  </Form>
);
```

The API can be accessed by `form` reference. Besides, any handler passed through `onSubmit` prop gets wrapped.
The component calls `setState` for `checkValidity` prior calling the specified handler. From the handler you can
access the API by reference like `form.setError`


## <InputGroup>
`InputGroup` defines scope and API for a group of arbitrary inputs registered with `validate` prop. `InputGroup` exposes in the scope parameters that can be used to toggle group validation message(s), group state representation and to access the component API

### Props
- <Object|Array> `validate` - register inputs to the group. Accepts either array of input names (to match `[name=*]`) or plain object out of pairs `name: custom validator`
```jsx
// Group of a single input
<InputGroup validate={[ "email" ]} />
// Group of multiple inputs
<InputGroup validate={[ "month", "year" ]} />
//
<InputGroup validate={{
          "vatId": ( input ) => {
            if ( !input.current.value.startsWith( "DE" ) ) {
              input.setCustomValidity( "Code must start with DE" );
              return false;
            }
            return true;
          }
        }}>
```
- <Object> `translate` - set custom messages for validation constraints (see [ValidityState Properties](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState))
```jsx
 <InputGroup
          ...
          translate={{
            firstName: {
              valueMissing: "C'mon! We need some value",
              patternMismatch: "Please enter a valid first name."
            }
          }}>
```
- <String> `tag` - define tag for the generated container HTML element (by default `div`)
```jsx
<InputGroup tag="fieldset" ... />
```
- <String> `className` - specify class name for the generated HTML element

### API
- `checkValidityAndUpdate()` - run `checkValidity()` and update the input group according to the actual validity state
- `getInputByName( name )` -  access input fo the group by given input name
- `getValidationMessages()` - get list of all validation messages within the group
- `checkValidity()` - find out if the input group has not inputs in invalid state

### Scope parameters
- <String> `error` - validation message for the first invalid input
- <String[]> `errors` - array of validation messages for all the inputs
- <Boolean> `valid` - input group validity state (product of input states)
- <React.Component> `inputGroup` - link to the component API


#### Basic use
```jsx
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
```

Here we define an input group with registered input matching `[name=email]`. We also specify a custom message for `ValidityState.valueMissing` constraint.
It means that during the validation the input has no value while having constraint attribute `required` the input group receive validation message `"C'mon! We need some value"` in scope parameter `error`.

#### Custom validators
```jsx
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
```

Here we define a custom validator for `vatId` input (via `validate` prop). The validator checks if the current input value starts with `"DE"`.
If it dosn't we apply `setCustomValidity` method to set the input (and the group) in invalid state (the same as of HTML5 Constraint validation API).


#### On-the-fly validation

Let's first define the onInput event handler:
```js
const onInput = ( e, inputGroup ) => {
  inputGroup.checkValidityAndUpdate();
};
```
We use `checkValidityAndUpdate` method to actualize validity state and update the component.

Now we subscribe the component:

```jsx
    <InputGroup validate={[ "firstName" ]}>
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
```

Here we delegate the handler reference to component instance like `onInput={( e ) => onInput( e, inputGroup ) }`


## Input

Represents input element.

### API
- `current` - input HTML element
- `setCustomValidity( message = "" )` - set the input in invalid state
- `checkValidity()` - returns boolean truthy when all the input in valid state
- `getValidationMessage()` - get validation message considering assigned custom message if any
