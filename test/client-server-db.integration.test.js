const puppeteer = require('puppeteer');

describe('INTEGRATION: CLIENT-SERVER-DB', () => {

  it(`returns the proper book (DUNE) for the id 3`, async (done) => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto('http://localhost:2002/?bookId=3');
      setTimeout(async () => {
        const title = await page.$eval('h1', e => e.innerHTML);
        expect(title).toBe('Dune');
        await browser.close();
        done();
      }, 1000);
  });

  it(`returns the proper book (Ready Player One) for the id 5`, async (done) => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto('http://localhost:2002/?bookId=5');
      setTimeout(async () => {
        const title = await page.$eval('h1', e => e.innerHTML);
        expect(title).toBe('Ready Player One');
        await browser.close();
        done();
      }, 1000);
  });

  it(`returns and displays the proper book (The Martian) for the id 49`, async (done) => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto('http://localhost:2002/?bookId=49');
      setTimeout(async () => {
        const title = await page.$eval('h1', e => e.innerHTML);
        expect(title).toBe('The Martian');
        await browser.close();
        done();
      }, 1000);
  });

  it(`returns and displays the proper book (Of Mice and Men) for the id 99`, async (done) => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto('http://localhost:2002/?bookId=99');
      setTimeout(async () => {
        const title = await page.$eval('h1', e => e.innerHTML);
        expect(title).toBe('Of Mice and Men');
        await browser.close();
        done();
      }, 1000);
  });
});