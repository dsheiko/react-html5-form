# React-html5-form

[![NPM Version](https://img.shields.io/npm/v/react-html5-form.svg?style=flat)](https://www.npmjs.com/package/react-html5-form)
[![NPM Downloads](https://img.shields.io/npm/dm/react-html5-form.svg?style=flat)](https://www.npmjs.com/package/react-html5-form)
[![codecov](https://codecov.io/gh/dsheiko/react-html5-form/branch/master/graph/badge.svg)](https://codecov.io/gh/dsheiko/react-html5-form)
[![Build Status](https://travis-ci.org/dsheiko/react-html5-form.png)](https://travis-ci.org/dsheiko/react-html5-form)

With the package you don't need to re-create form validation logic every time. Instead you take full advantage of [HTML5 Constraint Validation API](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation). Besides the package expose no custom input components, instead it provides wrapper `InputGroup`, which binds inputs (according to configuration) in the children DOM nodes. Thus you can go with both HTML controls and 3rd-party input components.


## Highlights
- Input implementation agnostic, can be used any arbitrary input controls (HTML or 3rd-party React components)
- Standard HTML5 syntax for validation constraints (like `<input type="email" required maxLength="50" ... />`)
- Can be extended with custom validators (again by using standard HTML5 API)
- Can be setup for custom validation messages per `input`/`ValidityState.Property`
- Form and input groups expose validity states, so you can use it to toggle scope error messages.
- Form and input groups expose reference to own instances for children DOM nodes. So you can, for example, subscribe for `input` event and run input group validation (e.g. see [On-the-fly validation](#on-the-fly-validation))
- Can maintain form state both ways: with React Context and Redux


## Overview
With `Form` we define scope of the form. The component exposes parameters `valid`, `error` and `form`. The first reflects actual validity state according to states of registered inputs. The second contains error message (can be set using API). The last one is instance of the component and provides access to the API.
With `InputGroup` we define a fieldset that contains one or more semantically related inputs (e.g. selects `day`, `month`, `year` usually go togather). The group expose `valid`, `error`, `errors` and `inputGroup` variables on children Nodes. So we can automatically toggle group error message and content `classList` depending on them.
We register inputs within `InputGroup` with `validate` prop. There we can specify a validator function, which will extend HTMP5 form validation logic. Very easily we can provide mapping for standard validation message (`translate` prop).


![react-html5-form in a single picture](https://github.com/dsheiko/react-html5-form/raw/master/docs/react-html5-form.png)


## Installation

```bash
npm i react-html5-form
```

## Demo

You can see the component in action at [LIVE DEMO](https://dsheiko.github.io/react-html5-form/) :tv:
- [source code](./demo/bootstrap/src/index.jsx) of example with HTML elements for inputs (styled with Bootstrap 4)
- [source code](./demo/materialui/src/index.jsx) of example with read-made components for inputs (styled with MaterialUI.Next)
- [source code](./demo/bootstrap-redux/src/index.jsx) of example with connection to Redux

```js
import { Form } from "Form";
```

## Form

Represents form

### Props
- `<Function>` `onSubmit` - (OPTIONAL) form submit handler
- `<Function>` `onMount` - (OPTIONAL) callback that gets invoked in `componentDidMount()`, it receives component instance as parameter
- `<Function>` `onUpdate` - (OPTIONAL) callback that gets invoked when form ready (all input groups registered) and when it changes validity state. It's intended to be used with Redux to update tree state
- any attributes of Form HTML element

### API
- `scrollIntoViewFirstInvalidInputGroup()` - scroll first input group in invalid state into view (happens automatically onSubmit)
- `checkValidityAndUpdateInputGroups()` - check form validity and update every input group
- `checkValidityAndUpdate()` - check form validity and update only form state (without updating input groups)
- `setError( message = "")` - set form scope error message
- `submit()` - submit form
- `getRef()` - get `Ref` instance pointed to the generated `FORM` element. Thus if you need to access the DOM node, you go with `form.getRef().current`
- `debugInputGroups( inx = null )` - get debug info about all registered inputs, or one matching given index

### Scope parameters
- `<String>` `error` - error message set with `setError()`
- `<Boolean>` `valid` - form validity state
- `<React.Component>` `form` - link to the component API

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
      { error && (<div className="alert alert-danger" role="alert">
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


## InputGroup
`InputGroup` defines scope and API for a group of arbitrary inputs registered with `validate` prop. `InputGroup` exposes in the scope parameters that can be used to toggle group validation message(s), group state representation and to access the component API

```js
import { Form, InputGroup } from "Form";
```

### Props
- <Object|Array> `validate` - (REQUIRED) register inputs to the group. Accepts either array of input names (to match `[name=*]`) or plain object out of pairs `name: custom validator`
```jsx
// Group of a single input
<InputGroup validate={[ "email" ]} />
// Group of multiple inputs
<InputGroup validate={[ "month", "year" ]} />
// Custom validator
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
- <Object> `translate` - (OPTIONAL) set custom messages for validation constraints (see [ValidityState Properties](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState))
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
- <String> `tag` - (OPTIONAL) define tag for the generated container HTML element (by default `div`)
```jsx
<InputGroup tag="fieldset" ... />
```
- `<Function>` `onMount` - (OPTIONAL) callback that gets invoked in `componentDidMount()`, it receives component instance as parameter
- `<Function>` `onUpdate` - (OPTIONAL) callback that gets invoked when form ready (all input groups registered) and when it changes validity state. It's intended to be used with Redux to update tree state
- any attributes of HTML element

### API
- `checkValidityAndUpdate()` - run `checkValidity()` and update the input group according to the actual validity state
- `getInputByName( name )` -  access input fo the group by given input name
- `getValidationMessages()` - get list of all validation messages within the group
- `checkValidity()` - find out if the input group has not inputs in invalid state
- `getRef()` - get `Ref` instance pointed to the generated element. Thus if you need to access the DOM node, you go with `inputGroup.getRef().current`

### Scope parameters
- `<String>` `error` - validation message for the first invalid input
- `<String[]>` `errors` - array of validation messages for all the inputs
- `<Boolean>` `valid` - input group validity state (product of input states)
- `<React.Component>` `inputGroup` - link to the component API


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

          <div className="form-group">
          <label htmlFor="emailInput">Email address</label>
            <input
              type="email"
              required
              name="email"
              className={`form-control ${!valid && "is-invalid"}`}
              id="emailInput"
              placeholder="Enter email" />

              { error && (<div className="invalid-feedback">{error}</div>)  }
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
              input.setCustomValidity( "Code must start with DE." );
              return false;
            }
            return true;
          }
        }}>
        {({ error, valid }) => (
          <div className="form-group">
            <label htmlFor="vatIdInput">VAT Number (optional)</label>
            <input
              className={`form-control ${!valid && "is-invalid"}`}
              id="vatIdInput"
              name="vatId"
              placeholder="Enter VAT Number"/>

            { error && (<div className="invalid-feedback">{error}</div>)  }

          </div>
        )}
      </InputGroup>
```

Here we define a custom validator for `vatId` input (via `validate` prop). The validator checks if the current input value starts with `"DE"`.
If it dosn't we apply `setCustomValidity` method to set the input (and the group) in invalid state (the same as of HTML5 Constraint validation API).

#### Group with multiple inputs

```js
const validateDateTime = ( input ) => {
  if ( input.current.value === "Choose..." ) {
      input.setCustomValidity( `Please select ${input.current.title}` );
      return false;
  }
  return true;
};
```

```jsx
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

          </div>
        )}
    </InputGroup>
```

On validation we receives `errors` array that contains validation messages for all the inputs registered in the group. So we can display the messages within the group container.


#### On-the-fly validation

Let's first define the `onInput` event handler:
```js
const onInput = ( e, inputGroup ) => {
  inputGroup.checkValidityAndUpdate();
};
```
We use `checkValidityAndUpdate` method to actualize validity state and update the component.

Now we subscribe the component:

```jsx
    <InputGroup
          validate={[ "firstName" ]}
          translate={{
            firstName: {
              patternMismatch: "Please enter a valid first name."
            }
          }}>
        {({ error, valid, inputGroup }) => (
          <div className="form-group">
            <label htmlFor="firstNameInput">First Name</label>
            <input
              pattern="^.{5,30}$"
              required
              className={`form-control ${!valid && "is-invalid"}`}
              id="firstNameInput"
              name="firstName"

              onInput={( e ) => onInput( e, inputGroup, form ) }
              placeholder="Enter first name"/>

            { error && (<div className="invalid-feedback">{error}</div>)  }
          </div>
        )}
    </InputGroup>
```

Here while assigning event handler inline we delegate the instance of component to earlier created `onInput` function like `onInput={( e ) => onInput( e, inputGroup ) }`. Thus we can operate it when responding to the event.


## Input

Represents input element within input group scope.

### API
- `current` - input HTML element
- `setCustomValidity( message = "" )` - set the input in invalid state
- `checkValidity()` - returns boolean truthy when all the input in valid state
- `getValidationMessage()` - get validation message considering assigned custom message if any

## Connecting to Redux store

The package exposes reducer `html5form`, so one can connect form/input group/input states to the store:

```jsx
import React from "react";
import { render } from "react-dom";
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";

import { App } from "./Containers/App.jsx";
import { html5form } from "Form";

const appReducer = combineReducers({
  html5form
});

// Store creation
const store = createStore( appReducer );

render( <Provider store={store}>
  <App />
 </Provider>, document.getElementById( "app" ) );


```

Thus we get package-specific state tree in the store:

![react-html5-form and Redux](https://github.com/dsheiko/react-html5-form/raw/master/docs/react-h5-redux.png)

- See full example [here](./demo/bootstrap-redux/src/index.jsx)