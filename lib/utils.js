const cheerio = require('cheerio');
const puppeteer = require("puppeteer");

async function createNewPuppeteerInstance(url) {
  const browser = await puppeteer.launch({
    headless: false,
    // executablePath: '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser'
  });
  const page = await browser.newPage();
  const navigationPromise = page.waitForNavigation();

  await page.goto(url);
  await navigationPromise;

  return { browser, page, navigationPromise };
}

async function puppeteerToHtml(url, onlyText = false) {
  const { browser, page } = await createNewPuppeteerInstance(url);

  let bodyHTML = await page.evaluate((onlyText) => {
    return onlyText ? document.body.innerText : document.body.innerHTML;
  }, onlyText);

  await browser.close();
  return bodyHTML;
}

function parseItems(body) {
  const items = [];
  const $ = cheerio.load(body);

  return new Promise((resolve, reject) => {
    $('.content-card').each((i, element) => {
      const place = {
        id: $(element)
          .data('place-id'),
        title: $(element)
          .find('.title-md')
          .text().replace(/(\r\n|\n|\r)/gm, "").trim(),
        location: $(element)
          .find('.place-card-location')
          .text(),
        description: $(element)
          .find('.content-card-subtitle')
          .text().replace(/(\r\n|\n|\r)/gm, "").trim(),
        url:
          'http://www.atlasobscura.com' +
          $(element)
            .attr('href'),
        img: $(element)
          .find('img')
          .data('src'),
      };
      if(place.id) { 
        items.push(place);
      }
    });
    resolve(items);
  });
}

function parseListItems(body, isList = false) {
  const items = [];
  const $ = cheerio.load(body);

  return new Promise((resolve, reject) => {
    $('.list-index-card').each((i, element) => {
      const list = {
        id: $(element)
        .find('a')
          .data('list-id'),
        title: $(element)
          .find('.screen-reader-description')
          .text().replace(/(\r\n|\n|\r)/gm, "").trim(),
        url:
          'http://www.atlasobscura.com' +
          $(element)
          .find('a')
            .attr('href'),
      };
      if(list.id) { 
        items.push(list);
      }
    });
    resolve(items);
  });
}

function parsePopularItems(body) {
  const items = [];
  const $ = cheerio.load(body);

  return new Promise((resolve, reject) => {
    $('.Card__content-wrap').each((i, element) => {
      const place = {
        id: $(element)
          .parent('a')
          .data('item-id'),
        title: $(element)
          .children('.Card__heading')
          .text().replace(/(\r\n|\n|\r)/gm, "").trim(),
        location: $(element)
          .children('.Card__hat')
          .text().replace(/(\r\n|\n|\r)/gm, ""),
        description: $(element)
          .children('.Card__content')
          .text().replace(/(\r\n|\n|\r)/gm, "").trim(),
        url:
          'http://www.atlasobscura.com' +
          $(element)
            .parent('a')
            .attr('href'),
        img: $(element)
          .prev('figure')
          .children()
          .attr('data-src')
      };
      items.push(place);
    });
    resolve(items);
  });
}

function parseTags(body) {
  const items = [];
  const $ = cheerio.load(body);

  return new Promise((resolve, reject) => {
    $('.tag-pill').each((i, element) => {
      const tag = {
        title: $(element)
          .children('a')
          .attr('title'),
        url:
          'http://www.atlasobscura.com' +
          $(element)
            .children('a')
            .attr('href'),
        count: $(element)
          .children('a')
          .children('.tag-pill-count')
          .text()
      };
      items.push(tag);
    });
    resolve(items);
  });
}

function getPaginationNextLink(body) {
  const $ = cheerio.load(body);
  const nextPageLink = $('.current')
    .next('.page')
    .find('a')
    .attr('href');
  return nextPageLink;
}

function parsePhotos(body) {
  const items = [];
  const $ = cheerio.load(body);

  return new Promise((resolve, reject) => {
    $('.js-item-image').each((i, element) => {
      const image = {
        img: $(element)
          .children('a')
          .children('img')
          .attr('src')
      };
      items.push(image);
    });
    resolve(items);
  });
}

function parseText(body) {
  const items = [];
  const $ = cheerio.load(body);

  return new Promise((resolve, reject) => {
    $('#place-body')
      .children()
      .each((i, element) => {
        const text = $(element).text().replace(/(\r\n|\n|\r)/gm, "").trim();
        if(text !== '') {
          items.push(text);
        }
      });
    resolve(items);
  });
}

module.exports = {
  parseItems,
  parseListItems,
  parsePopularItems,
  parseTags,
  parsePhotos,
  parseText,
  getPaginationNextLink,
  createNewPuppeteerInstance,
  puppeteerToHtml
};
