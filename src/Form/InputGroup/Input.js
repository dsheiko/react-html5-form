const VALIDITY_PROPS = [
  "badInput",
  "customError",
  "patternMismatch",
  "rangeOverflow",
  "rangeUnderflow",
  "stepMismatch",
  "tooLong",
  "tooShort",
  "typeMismatch",
  "valueMissing"
];

export class Input {

  constructor({ el, name, customValidator, translate }) {
    this.current = el;
    this.name = name;
    this.customValidator = customValidator;
    this.assignedValidationMessages = {};
    this.applyValidationMessageMapping( translate );
  }

  setCustomValidity( message = "" ) {
    return this.current.setCustomValidity( message );
  }

  checkValidity() {
    this.setCustomValidity();
    return this.current.checkValidity() && this.customValidator( this );
  }

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
    if ( VALIDITY_PROPS.indexOf( prop ) === -1 ) {
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
    const invalidProp = VALIDITY_PROPS.find( prop => validity[ prop ] );
    return ( invalidProp && invalidProp in this.assignedValidationMessages ) ?
      this.assignedValidationMessages[ invalidProp ] : false;
  }

  /**
  * Try to get message associated with currently invalid state property
  * If failed, standard assiciated message
  * If failed, browser validation message
  * @returns {string}
  */
  getValidationMessage() {
    const validity = this.current.validity,
          assignedMessage = this.getAssignedValidationMessage( validity );

    if ( assignedMessage ) {
      return assignedMessage;
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
