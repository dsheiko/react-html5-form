const DEFAULT_VALIDITY = {
        badInput: false,
        customError: false,
        patternMismatch: false,
        rangeOverflow: false,
        rangeUnderflow: false,
        stepMismatch: false,
        tooLong: false,
        tooShort: false,
        typeMismatch: false,
        valueMissing: false,
        valid: true
     };

export class Input {

  constructor({ locator, name, customValidator, translate, parent }) {
    this.locator = locator;
    this.name = name;
    this.customValidator = customValidator;
    this.assignedValidationMessages = {};
    this.applyValidationMessageMapping( translate );
    this.parent = parent;
    this.parent.updateStoreForInputValidity( name, DEFAULT_VALIDITY, "" );
    this.setPristine = () => {
      this.parent.setPristine();
    };
    this.subscribePristineHandler();
  }

  /**
   * Change Pristine on the first input
   */
  subscribePristineHandler() {
    const el = this.current;
    if ( !el ) {
      return;
    }
    el.addEventListener( "input", this.setPristine, false );
  }

  get current() {
    if ( !this.currentCache ) {
      this.currentCache = this.locator();
    }
    if ( !this.currentCache ) {
      this.parent.updateState([`Could not find selector [name="${this.name}"]`], false);
    }
    return this.currentCache;
  }

  /**
   * Shortcut to setCustomValidity on DOM node
   * @param {String} message
   */
  setCustomValidity( message = "" ) {
    return this.current.setCustomValidity( message );
  }

  /**
   * Check checkValidity implementaiton. First it resets custom validity and gets input validity logical conjunction
   * DOM node one and registered custom validator
   * @returns {Boolean}
   */
  checkValidity() {
    if ( !this.current ) {
      return false;
    }
    this.setCustomValidity();
    const valid = this.current.checkValidity() && this.customValidator( this );
    this.parent.updateStoreForInputValidity( this.name, this.getValidity(), this.getValidationMessage() );
    return valid;
  }

  /**
   * Get validity as a plain object
   * @returns {Object}
   */
  getValidity() {
    if ( !this.current ) {
      return DEFAULT_VALIDITY;
    }
    return Object.keys( DEFAULT_VALIDITY ).reduce(( carry, prop ) => {
      carry[ prop ] = this.current.validity[ prop ];
      return carry;
    }, {});
  }

  /**
   * Process object passed with translate
   * @param {Object} translate
   */
  applyValidationMessageMapping( translate ) {
    translate && Object.keys( translate ).forEach( key => {
      this.assignValidationMessage( key, translate[ key ] );
    });
  }

  /**
   * Assign custom message to one of ValidityState property
   * in scope of the fieldset
   *
   * @public
   * @param {string} prop
   * @param {string} message
   */
  assignValidationMessage( prop, message ) {
    if ( Object.keys( DEFAULT_VALIDITY ).indexOf( prop ) === -1 ) {
      throw new Error( `Invalid validity property ${prop}` );
    }
    this.assignedValidationMessages[ prop ] = message;
  }

  /**
   * Obtain message assotiated with currently invalid state prop or false if none is
   *
   * @param {ValidityState} validity
   * @returns {string|false}
   */
  getAssignedValidationMessage( validity ) {
    const invalidProp = Object.keys( DEFAULT_VALIDITY ).find( prop => validity[ prop ] );
    return ( invalidProp && invalidProp in this.assignedValidationMessages ) ?
      this.assignedValidationMessages[ invalidProp ] : false;
  }

  /**
  * Try to get message associated with currently invalid state property
  * If failed, standard assiciated message
  * If failed, browser validation message
  * @param {ValidityState} [validityState=null]
  * @returns {string}
  */
  getValidationMessage( validityState = null ) {
    const validity = validityState || this.getValidity(),
          assignedMessage = this.getAssignedValidationMessage( validity );

    if ( assignedMessage ) {
      return assignedMessage;
    }

    if ( !this.current ) {
      return "";
    }

    switch ( true ) {
      case validity.valueMissing:
        return `Please fill out this field.`;
      case validity.rangeOverflow:
        return `Value must be less than or equal to ${this.current.max}.`;
      case validity.rangeUnderflow:
        return `Value must be greater than or equal to ${this.current.min}.`;
      case validity.tooLong:
        return `Value must be less than ${this.current.maxlength} length.`;
      case validity.tooShort:
        return `Value must be more than ${this.current.minlength} length.`;
      case validity.typeMismatch:
        return `Value is not a valid ${this.current.type}.`;
    }

    return this.current.validationMessage;
  }

}
