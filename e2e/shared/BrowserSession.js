const { BASE_URL } = require( "./constants" );

class BrowserSession {
  constructor( puppeteer ) {
    this.puppeteer = puppeteer;
  }

  async openPageOn( width, height ) {
    await this.page.setViewport({ width, height });
    await this.page.goto( BASE_URL, { waitUntil: "networkidle2" } );
  }

  /**
   * Obtain browser and page object on bootstrap
   */
  async setup() {
    this.browser = await this.puppeteer.launch(
       // when called like DEBUG=true jest
       // open in a browser
       process.env.DEBUG
        ? {
            headless: false,
            slowMo: 40,
            devtools: false
          }
        : {}
    );
    this.page = await this.browser.newPage();
  }

  /**
   * Close browser on teardown
   */
  async teardown() {
    if ( process.env.DEBUG ) {
      return;
    }
    this.browser.close();
  }
}


module.exports = BrowserSession;
