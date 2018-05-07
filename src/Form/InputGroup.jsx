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

  /**
   * Helper to extract input names for both syntaxes valid for validate prop
   * @param {*} validate
   * @returns {Array}
   */
  extractInputNames( validate ) {
    if ( Array.isArray( validate ) ) {
      return validate;
    }
    return Object.keys( validate );
  }

  /**
   * Register inputs by props validate and translate. Invoke onMount
   */
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

  /**
   * Get array of input validation messages
   * @returns {String[]}
   */
  getValidationMessages() {
    return this.inputs
      .map( input => input.getValidationMessage() )
      .filter( msg => Boolean( msg ) );
  }

  /**
   * Helper to update component state
   * @param {String[]} errors
   * @param {Boolean} valid
   */
  updateState( errors, valid ) {
    this.setState({
      valid,
      error: ( errors.length ? errors[ 0 ] : null),
      errors
    });
  }

  /**
   * Get input by its name
   * @param {String} name
   * @returns {Input}
   */
  getInputByName( name ) {
    if ( !this.inputs ) {
      return null;
    }
    return this.inputs.find( input => ( input.name === name ));
  }

  /**
   * Check form validity and update the sate
   */
  checkValidityAndUpdate() {
    const valid = this.checkValidity();
    if ( valid ) {
      this.updateState([], true);
      return true;
    }
    this.updateState(this.getValidationMessages(), false);
    return false;
  }

  /**
   * Get group actual validity by logical conjunction of all registered inputs
   * @returns {Boolean}
   */
  checkValidity() {
    this.valid = this.inputs.reduce( ( isValid, input ) => {
      return input.checkValidity() && isValid;
    }, true );
    return this.valid;
  }

  /**
   * Extract properties for delegation to generated element
   *
   * @param {Object} props
   * @returns {Object}
   */
  static normalizeTagProps( props ) {
    const whitelisted = { ...props };
    [ "validate" , "translate", "tag", "registerInputGroup", "onMount" ].forEach( prop => {
      if ( prop in whitelisted ) {
        delete whitelisted[ prop ];
      }
    });
    return whitelisted;
  }

   /**
   * Render the component
   * @returns {React.Component}
   */
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