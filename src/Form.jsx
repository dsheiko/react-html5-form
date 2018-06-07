import React from "react";
import PropTypes from "prop-types";
import { FormContext } from "./Form/Context";
// Exports
export { InputGroup } from "./Form/InputGroup";
export { html5form } from "./Redux/Reducers";
import * as actions from "./Redux/Actions";
export const actionCreators = actions;

const AUTOCOMPLETE_TIMEOUT = 50;
let counter = 0;

export class Form extends React.Component {

  constructor( props ) {
    super( props );
    this.valid = false;
    counter++,
    this.id = props.id || `__form${counter}`;

    this.updateStoreForFormValidity( true, "" );

    this.form = React.createRef();
    this.onSubmit = this.onSubmit.bind( this );

    /***
    * Set pristine to true when first input
    */
    const setPristine = () => {
      if ( !this.state.pristine ) {
        return;
      }
      this.setState({
        pristine: false
      });
    };

    const registerInputGroup = ( instance ) => {
      this.setState( state => {
        return {
          inputGroups: [ ...state.inputGroups, instance ]
        };
      });
    };

    const updateStoreForInputGroupValidity = ( groupId, valid, errors ) => {
      const { formActions } = props;
      formActions && formActions.updateInputGroupValidity(
        this.id, groupId, valid, errors
      );
    };

    const updateStoreForInputValidity = ( groupId, name, validity, validationMessage ) => {
      const { formActions } = props;
      formActions && formActions.updateInputValidity(
        this.id, groupId, name, validity, validationMessage
      );
    };

    const updateStoreForPristine = ( groupId ) => {
      const { formActions } = props;
      formActions && formActions.updatePristine(
        this.id, groupId
      );
    };


    this.setError = ( message ) => {
      this.updateStoreForFormValidity( message, this.valid );
      this.setState({ error: message });
    };

    this.state = {
      valid: true,
      error: null,
      inputGroups: [],
      pristine: true,
      submitting: false,
      submitted: false,
      registerInputGroup,
      updateStoreForInputGroupValidity,
      updateStoreForInputValidity,
      setPristine,
      updateStoreForPristine,
      setError: this.setError
    };
  }

  /**
   * Invoke onUpdate handler
   * @param {Object} prevProps
   * @parma {Object} prevState
   */
  componentDidUpdate( prevProps, prevState ) {
    const { onUpdate, inputGroups } = this.props;
    if ( onUpdate && this.state.inputGroups.length && this.state.valid !== prevState.valid ) {
      onUpdate( this );
    }
  }

  /**
   * Invoke onMount handler
   */
  componentDidMount() {
    const { onMount } = this.props;
    setTimeout(() => {
      onMount ? onMount( this ) : this.checkValidityAndUpdate();
    }, AUTOCOMPLETE_TIMEOUT);
  }

  /**
   * Update Redux store for form validity
   * @param {Boolean} valid
   * @param {String} error
   */
  updateStoreForFormValidity( valid, error ) {
    const { formActions } = this.props;
    formActions && formActions.updateFormValidity(
      this.id, valid, error
    );
  }
  /**
   * Toogle form state prop submitted
   */
  updateSubmitted() {
    const { formActions } = this.props;
    this.setState({ submitted: true });
    formActions && formActions.updateSubmitted( this.id );
  }

  /**
   * Abstract method to be overriden by a concrete implementation
   * @param {Event} e
   */
  async onSubmit( e = null ) {
    const { onSubmit } = this.props;
    e && e.preventDefault();
    this.toggleSubmitting( true );
    this.checkValidityAndUpdateInputGroups();
    this.valid || this.scrollIntoViewFirstInvalidInputGroup();
    if ( this.valid && onSubmit ) {
      await onSubmit.call( this, this );
    }
    this.toggleSubmitting( false );
    this.updateSubmitted();
  }
  /**
   * Toggle submitting state
   * @param {boolean} submitting
   */
  toggleSubmitting( submitting = false ) {
    const { formActions } = this.props;
    formActions && formActions.updateSubmitting( this.id, submitting );
    this.setState({ submitting });
  }

  /**
   * Shortcut to submit form
   */
  submit() {
    this.getRef().current.submit();
  }

  /**
   * Shortcut to access Ref on bounding DOM node
   */
  getRef() {
    return this.form;
  }

  /**
   * Find the first input group in error state
   * @returns {InputGroup}
   */
  getFirstInvalidInputGroup() {
    return this.state.inputGroups.find( group => !group.valid );
  }

  /**
   * Get debug info about registered input groups
   * @param {Number} inx
   * @returns {Object}
   */
  debugInputGroups( inx = null ) {
    const debug = this.state.inputGroups.map( inputGroup => ({
      name: inputGroup.inputGroup.current.name || "undefined",
      valid: inputGroup.checkValidity(),
      inputs: inputGroup.inputs.map( input => ({
        name: input.name,
        valid: input.checkValidity()
      }))
    }));
    return inx === null ? debug : debug[ inx ];
  }

  /**
   * Scroll the first errored input group into view
   */
  scrollIntoViewFirstInvalidInputGroup() {
    const firstInvalid = this.getFirstInvalidInputGroup();
    if ( firstInvalid && "scrollIntoView" in firstInvalid.inputGroup.current ) {
      firstInvalid.inputGroup.current.scrollIntoView();
    }
  }

  /**
   * Check form validity and update every input group
   */
  checkValidityAndUpdateInputGroups() {
    const valid = this.checkValidity( "checkValidityAndUpdate" );
    this.setState({ valid });
    return valid;
  }

  /**
   * Check form validity and update the component state
   */
  checkValidityAndUpdate() {
    const valid = this.checkValidity( "checkValidity" );
    this.setState({ valid });
    return valid;
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
    this.updateStoreForFormValidity( this.valid, this.state.error );
    return this.valid;
  }

  /**
   * Extract properties for delegation to generated form element
   * @param {Object} props
   * @returns {Object}
   */
  static normalizeTagProps( props ) {
    const whitelisted = { ...props };
    [ "onSubmit", "onMount", "onUpdate", "formActions", "formState" ].forEach( prop => {
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
    const { inputs, children, formActions, formState } = this.props,
      { error, valid, pristine, submitting, submitted } = this.state,
      context = { ...this.state, formActions, formState },
      form = this,
      tagProps = Form.normalizeTagProps( this.props );

    return (
      <FormContext.Provider value={context}>
          <form noValidate ref={this.form} {...tagProps} onSubmit={this.onSubmit}>
            { children( { error, valid, pristine, submitting, submitted, form } ) }
          </form>
      </FormContext.Provider>
    );
  }
}

Form.propTypes = {
  onSubmit: PropTypes.func,
  onMount: PropTypes.func,
  onUpdate: PropTypes.func,
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