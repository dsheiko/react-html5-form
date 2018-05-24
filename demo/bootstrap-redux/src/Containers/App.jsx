import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Main } from "../Components/Main.jsx";
import { actionCreators } from "Form";

// Mapping state to the props
const mapStateToProps = ( state ) => ({ formState: state });
// Mapping actions to the props
const mapDispatchToProps = ( dispatch ) => ({
  formActions: bindActionCreators( actionCreators, dispatch )
});

class DemoApp extends Component {
  render() {
    return (
        <Main {...this.props} />
    );
  }
};

export const App = connect(
  mapStateToProps,
  mapDispatchToProps
)( DemoApp );