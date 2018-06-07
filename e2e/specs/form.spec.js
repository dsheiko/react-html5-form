const puppeteer = require( "puppeteer" ),
      BrowserSession = require( "../shared/BrowserSession" ),
      { png } = require( "../shared/helpers" ),
      { SEL_FORM, SEL_SUBMIT, SEL_EMAIL, SEL_FNAME, SEL_VATID,
        SEL_DAY, SEL_MONTH, SEL_FORM_ERROR,
      ASYNC_TRANSITION_TIMEOUT, NETWORK_TIMEOUT } = require( "../shared/constants" ),

      bs = new BrowserSession( puppeteer );

jest.setTimeout( NETWORK_TIMEOUT );

describe( "Boostrap Form Demo", () => {


  beforeAll(async () => {
    await bs.setup();
  });

  afterAll(async () => {
    await bs.teardown();
  });

  describe( "Form", () => {

    beforeEach(async () => {
      await bs.openPageOn( 1280, 1024 );
    });

    describe( "Submit button", () => {
      it( "is disabled before any input", async () => {
        const form = await bs.page.$( SEL_FORM ),
              submitBtn = await form.$( SEL_SUBMIT );

        await submitBtn.screenshot( png( `form-submit-before-input` ) );

        const isDisabled = await form.$eval( `${SEL_FORM} ${SEL_SUBMIT}`, el => el.disabled );
        expect( isDisabled ).toBeTruthy();

      });

      it( "is enabled after any input", async () => {
        const form = await bs.page.$( SEL_FORM ),
              submitBtn = await form.$( SEL_SUBMIT ),
              email = await form.$( SEL_EMAIL );

        await email.type( SEL_EMAIL, `anything` );
        await submitBtn.screenshot( png( `form-submit-after-input` ) );

        const isDisabled = await form.$eval( `${SEL_FORM} ${SEL_SUBMIT}`, el => el.disabled );
        expect( isDisabled ).not.toBeTruthy();
      });
    });

    describe( "Email field", () => {
      it( "gets invalid state when invalid emailed typed in", async () => {

        const form = await bs.page.$( SEL_FORM ),
            submitBtn = await form.$( SEL_SUBMIT ),
            email = await form.$( SEL_EMAIL );

        await email.type( `invalid-email` );
        await submitBtn.click();
        await bs.page.waitFor( ASYNC_TRANSITION_TIMEOUT );
        const isInvalid = await form.$eval( `${SEL_FORM} ${SEL_EMAIL}`, el => el.matches( `:invalid` ) );
        await form.screenshot( png( `form-email-invalid-state` ) );
        expect( isInvalid ).toBeTruthy();

      });
    });

    describe( "Submission", () => {
      it( "gets invalid state when invalid emailed typed in", async () => {

        const form = await bs.page.$( SEL_FORM ),
            submitBtn = await form.$( SEL_SUBMIT );

        await bs.page.type( `${SEL_FORM} ${SEL_EMAIL}`, `valid@email.com` );
        await bs.page.type( `${SEL_FORM} ${SEL_FNAME}`, `Jon Snow` );
        await bs.page.type( `${SEL_FORM} ${SEL_VATID}`, `DE000` );
        await bs.page.select( `${SEL_FORM} ${SEL_DAY}`, `...` );
        await bs.page.select( `${SEL_FORM} ${SEL_MONTH}`, `...` );

        await submitBtn.click();
        await bs.page.waitForSelector( `${SEL_FORM}[data-submitted=true]` );

        await form.screenshot( png( `form-submitted` ) );

        const errorMsg = await form.$eval( `${SEL_FORM} ${SEL_FORM_ERROR}`, el => el.innerText );
        expect( errorMsg ).toEqual( `Oh snap! Opps, a server error` );

      });
    });

  });
});