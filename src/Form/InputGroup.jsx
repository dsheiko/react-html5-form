import React from "react";
import PropTypes from "prop-types";
import { FormContext } from "./Context";
import { Input } from "./InputGroup/Input";

export class InputGroupComponent extends React.Component {

  constructor( props ) {
    super( props );
    this.inputGroup = React.createRef();
    this.valid = true;
    this.state = {
      valid: true,
      error: null,
      errors: []
    };
  }


  extractInputNames( validate ) {
    if ( Array.isArray( validate ) ) {
      return validate;
    }
    return Object.keys( validate );
  }


  componentDidMount() {
    const { validate, registerInputGroup, translate, onMount } = this.props,
          names = this.extractInputNames( validate );
    this.inputs = names
      .map( name => {
        const selector = `[name="${name}"]`,
              customValidator = ( name in validate ? validate[ name ] : () => true ),
              tMap = ( translate && name in translate ? translate[ name ] : null ),
              el = this.inputGroup.current.querySelector( selector );

        if ( !el ) {
          this.updateState([`Could not find selector ${selector}`], false);
          return null;
        }
        return new Input({ el, name, customValidator, translate: tMap });
      })
      .filter( el => Boolean( el ) );

    registerInputGroup( this );
    onMount && onMount( this );
  }

  getValidationMessages() {
    return this.inputs
      .map( input => input.getValidationMessage() )
      .filter( msg => Boolean( msg ) );
  }

  updateState( errors, valid ) {
    this.setState({
      valid,
      error: ( errors.length ? errors[ 0 ] : null),
      errors
    });
  }

  getInputByName( name ) {
    if ( !this.inputs ) {
      return null;
    }
    return this.inputs.find( input => ( input.name === name ));
  }

  checkValidityAndUpdate() {
    const valid = this.checkValidity();
    if ( valid ) {
      this.updateState([], true);
      return true;
    }
    this.updateState(this.getValidationMessages(), false);
    return false;
  }

  checkValidity() {
    this.valid = this.inputs.reduce( ( isValid, input ) => {
      return input.checkValidity() && isValid;
    }, true );
    return this.valid;
  }

  static normalizeTagProps( props ) {
    const whitelisted = { ...props };
    [ "validate" , "translate", "tag", "registerInputGroup", "onMount" ].forEach( prop => {
      if ( prop in whitelisted ) {
        delete whitelisted[ prop ];
      }
    });
    return whitelisted;
  }

  render() {
    const { children, tag = "div", className } = this.props,
          Container = `${tag}`,
          tagProps = InputGroupComponent.normalizeTagProps( this.props ),
          args = { ...this.state, inputGroup: this };
    return (
        <Container ref={this.inputGroup} {...tagProps}>{ children( args ) } </Container>);
  }
};


export const InputGroup = ( props ) => (
  <FormContext.Consumer>
    {({ registerInputGroup }) => <InputGroupComponent {...props} registerInputGroup={registerInputGroup} />}
  </FormContext.Consumer>
);

InputGroup.propTypes = {
  validate: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]).isRequired,
  registerInputGroup: PropTypes.func,
  onMount: PropTypes.func,
  translate: PropTypes.object,
  tag: PropTypes.string,
  className: PropTypes.string
};