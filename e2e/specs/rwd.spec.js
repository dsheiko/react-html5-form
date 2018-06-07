const puppeteer = require( "puppeteer" ),
      BrowserSession = require( "../shared/BrowserSession" ),
      { png } = require( "../shared/helpers" ),
      { SEL_FORM, SEL_SUBMIT, SEL_EMAIL, SEL_FNAME,
      SEL_JUMBOTRON_DESC, NETWORK_TIMEOUT } = require( "../shared/constants" ),

      bs = new BrowserSession( puppeteer );

jest.setTimeout( NETWORK_TIMEOUT );

describe( "Boostrap Form Demo", () => {


  beforeAll(async () => {
    await bs.setup();
  });

  afterAll(async () => {
    await bs.teardown();
  });


  describe( "Responsive Web Design", () => {
    describe( "Jumbotron description", () => {

      it( "is visible on 1280x1024", async () => {
        await bs.openPageOn( 1280, 1024 );
        await bs.page.screenshot( png( `rwd-jumbotron-on-1280x1024` ) );
        const el = await bs.page.$( SEL_JUMBOTRON_DESC );
        const isVisible = ( await el.boundingBox() !== null );
        expect( isVisible ).toBeTruthy();
      });

      it( "is not visible on 375x812", async () => {
        await bs.openPageOn( 375, 812 );
        await bs.page.screenshot( png( `rwd-jumbotron-on-375x812` ) );
        const el = await bs.page.$( SEL_JUMBOTRON_DESC );
        const isVisible = ( await el.boundingBox() !== null );
        expect( isVisible ).not.toBeTruthy();
      });

    });

    describe( "Email/First Name inputs", () => {
      it( "are on the same line when 1280x1024", async () => {
        await bs.openPageOn( 1280, 1024 );

        const form = await bs.page.$( SEL_FORM ),
              email = await bs.page.$( SEL_EMAIL ),
              firstName = await bs.page.$( SEL_FNAME );

        await form.screenshot( png( `rwd-email-fname-on-1280x1024` ) );
        const emailBox = await email.boundingBox(),
              firstNameBox = await firstName.boundingBox();

        expect( emailBox.y ).toEqual( firstNameBox.y );

      });

      it( "are not on the same line when 375x812", async () => {
        await bs.openPageOn( 375, 812 );

        const form = await bs.page.$( SEL_FORM ),
              email = await bs.page.$( SEL_EMAIL ),
              firstName = await bs.page.$( SEL_FNAME );

        await form.screenshot( png( `rwd-email-fname-on-375x812` ) );
        const emailBox = await email.boundingBox(),
              firstNameBox = await firstName.boundingBox();

        expect( emailBox.y ).not.toEqual( firstNameBox.y );
      });
    });
  });
});