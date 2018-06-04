import React from "react";
import PropTypes from "prop-types";
import { FormContext } from "./Context";
import { Input } from "./InputGroup/Input";

let counter = 0;

export class InputGroupComponent extends React.Component {

  constructor( props ) {
    super( props );
    counter++,
    this.id = "id" in props ? props.id : `__igroup${counter}`;
    this.inputGroup = React.createRef();
    this.valid = true;

    this.state = {
      valid: true,
      error: null,
      errors: [],
      pristine: true
    };
  }

  /***
   * Set pristine to true when first input
   */
  setPristine() {
    this.props.setPristine();
    if ( !this.state.pristine ) { 
      return;
    }
    this.props.updateStoreForPristine( this.id );
    this.setState({
      pristine: false
    });
  }

  /**
   * Shortcut to access Ref on bounding DOM node
   */
  getRef() {
    return this.inputGroup;
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
   * Invoke onUpdate handler
   * @param {Object} prevProps
   * @parma {Object} prevState
   */
  componentDidUpdate( prevProps, prevState ) {
    const { onUpdate } = this.props;
    if ( onUpdate && this.state.valid !== prevState.valid ) {
      onUpdate( this );
    }
  }

  /**
   * Register inputs by props validate and translate. Invoke onMount
   */
  componentDidMount() {
    const { validate, registerInputGroup, translate, onMount, updateStoreForInputGroupValidity, setPristine } = this.props,
          names = this.extractInputNames( validate );

    this.inputs = names
      .map( name => {
        const selector = `[name="${name}"]`,
              customValidator = ( name in validate ? validate[ name ] : () => true ),
              tMap = ( translate && name in translate ? translate[ name ] : null ),
              locator = () => this.inputGroup.current.querySelector( selector );

        return new Input({ locator, name, customValidator, translate: tMap, parent: this });
      });
    // Register input group in redux store
    updateStoreForInputGroupValidity( this.id, true, [] );
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
   * Update Redux store for input validity
   * @param {string} name
   * @param {Object} validity
   * @param {string} validationMessage
   */
  updateStoreForInputValidity( name, validity, validationMessage ) {
    this.props.updateStoreForInputValidity( this.id, name, validity, validationMessage );
  }

  /**
   * Helper to update component state
   * @param {String[]} errors
   * @param {Boolean} valid
   */
  updateState( errors, valid ) {
    this.props.updateStoreForInputGroupValidity( this.id, valid, errors );
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
    if ( !this.inputs || !this.inputs.length ) {
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
    [ "validate",
      "translate",
      "tag",
      "registerInputGroup",
      "onMount",
      "onUpdate",
      "updateStoreForInputValidity",
      "updateStoreForInputGroupValidity",
      "setPristine",
      "updateStoreForPristine" ].forEach( prop => {
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
    const { children, tag = "div", className, updateInputValidity, formAction, formState } = this.props,
          Container = `${tag}`,
          props = { id: this.id, ...this.props },
          tagProps = InputGroupComponent.normalizeTagProps( props ),
          args = { ...this.state, inputGroup: this };

    return (
        <Container ref={this.inputGroup} {...tagProps}>{ children( args ) } </Container>);
  }
};


export const InputGroup = ( props ) => (
  <FormContext.Consumer>
    {({ registerInputGroup,
      setPristine,
      updateStoreForInputGroupValidity,
      updateStoreForInputValidity,
      updateStoreForPristine }) => <InputGroupComponent {...props}
        setPristine={setPristine}
        registerInputGroup={registerInputGroup}
        updateStoreForInputValidity={updateStoreForInputValidity}
        updateStoreForInputGroupValidity={updateStoreForInputGroupValidity}
        updateStoreForPristine={updateStoreForPristine}
      />}
  </FormContext.Consumer>
);

InputGroup.propTypes = {
  validate: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]).isRequired,
  onUpdate: PropTypes.func,
  onMount: PropTypes.func,
  translate: PropTypes.object,
  tag: PropTypes.string,
  className: PropTypes.string
};

InputGroupComponent.propTypes = {
  ...InputGroup.propTypes,
  registerInputGroup: PropTypes.func,
  setPristine: PropTypes.func,
  updateStoreForInputValidity: PropTypes.func,
  updateStoreForInputGroupValidity: PropTypes.func,
  updateStoreForPristine: PropTypes.func
};