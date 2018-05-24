import { InputGroupComponent } from "../Form/InputGroup";

describe( "InputGroup", () => {

  it( "returns null when no inputs", () => {
    const group = new InputGroupComponent({});
    const res = group.getInputByName( null );
    expect( res ).toEqual( null );
  });


  it( "calls update only when state changes", ( done ) => {
    const group = new InputGroupComponent({ onUpdate: ( instance ) => {
        expect( instance ).not.toBeNull();
        done();
    }});
    group.componentDidUpdate( {}, { valid: false } );

  });

});

