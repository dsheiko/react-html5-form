import React from "react";
import PropTypes from "prop-types";
import { FormContext } from "./Form/Context";

export { InputGroup } from "./Form/InputGroup";

const AUTOCOMPLETE_TIMEOUT = 50;

export class Form extends React.Component {

  constructor( props ) {
    super( props );
    this.valid = false;
    this.form = React.createRef();
    this.onSubmit = this.onSubmit.bind( this );

    this.registerInputGroup = ( instance ) => {
      this.setState( state => {
        return {
          inputGroups: [ ...state.inputGroups, instance ]
        };
      });
    };

    this.setError = ( message ) => {
      this.setState({ error: message });
    };

    this.state = {
      valid: true,
      error: null,
      inputGroups: [],
      registerInputGroup: this.registerInputGroup,
      setError: this.setError
    };
  }

  /**
   * Invoke onMount handler
   */
  componentDidMount() {
    const { onMount } = this.props;
    setTimeout(() => this.checkValidityAndUpdate(), AUTOCOMPLETE_TIMEOUT);
    onMount && onMount( this );
  }

  /**
   * Abstract method to be overriden by a concrete implementation
   */
  onSubmit( e ) {
    const { onSubmit } = this.props;
    e.preventDefault();
    this.checkValidityAndUpdateInputGroups();
    onSubmit && onSubmit.call( this, this );
  }

  /**
   * Shortcut to submit form
   */
  submit() {
    this.form.current.submit();
  }

  /**
   * Scroll the first errored input group into view
   */
  scrollIntoViewFirstInvalidInputGroup() {
    const firstInvalid = this.state.inputGroups.find( group => !group.valid );
    if ( firstInvalid && "scrollIntoView" in firstInvalid.inputGroup.current ) {
      firstInvalid.inputGroup.current.scrollIntoView();
    }
  }

  /**
   * Check form validity and update every input group
   */
  checkValidityAndUpdateInputGroups() {
    this.setState({ valid: this.checkValidity() });
  }

  /**
   * Check form validity and update the component state
   */
  checkValidityAndUpdate() {
    this.setState({ valid: this.checkValidity( "checkValidity" ) });
  }

  /**
   * Get form actual validity by logical conjunction of all registered inputs
   * @param {String} [groupMethod = "checkValidityAndUpdate"]
   * @returns {Boolean}
   */
  checkValidity( groupMethod = "checkValidityAndUpdate" ) {
    this.valid = this.state.inputGroups.reduce( ( isValid, group ) => {
      const valid = group[ groupMethod ]();
      return valid && isValid;
    }, true );
    this.valid || this.scrollIntoViewFirstInvalidInputGroup();
    return this.valid;
  }

  /**
   * Extract properties for delegation to generated form element
   * @param {Object} props
   * @returns {Object}
   */
  static normalizeTagProps( props ) {
    const whitelisted = { ...props };
    [ "onSubmit", "onMount" ].forEach( prop => {
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
    const { inputs, children } = this.props,
      { error, valid } = this.state,
      form = this,
      tagProps = Form.normalizeTagProps( this.props );

    return (
      <FormContext.Provider value={this.state}>
          <form noValidate ref={this.form} {...tagProps} onSubmit={this.onSubmit}>
            { children( { error, valid, form } ) }
          </form>
      </FormContext.Provider>
    );
  }
}

Form.propTypes = {
  onSubmit: PropTypes.func,
  onMount: PropTypes.func,
  tabindex: PropTypes.string,
  title: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string,
  action: PropTypes.string,
  autoComplete: PropTypes.string,
  encType: PropTypes.string,
  method: PropTypes.string,
  name: PropTypes.string,
  target: PropTypes.string
};