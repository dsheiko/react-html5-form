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
const store = createStore(
  appReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

render( <Provider store={store}>
  <App />
 </Provider>, document.getElementById( "app" ) );

