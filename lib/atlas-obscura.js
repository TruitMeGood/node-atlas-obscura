const puppeteer = require("puppeteer");
const slugify = require("@sindresorhus/slugify");

const {
  parseItems,
  parsePopularItems,
  parseTags,
  getPaginationNextLink,
  parsePhotos,
  parseText,
} = require("./utils");

async function puppeteerToHtml(url, onlyText = false) {
  const browser = await puppeteer.launch({
    headless: false,
    // executablePath: '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser'
  });
  const page = await browser.newPage();
  const navigationPromise = page.waitForNavigation();

  await page.goto(url);
  await navigationPromise;

  let bodyHTML = await page.evaluate((onlyText) => {
    return onlyText ? document.body.innerText : document.body.innerHTML;
  }, onlyText);

  await browser.close();
  return bodyHTML;
}

class AtlasObscura {
  async getPopular() {
    try {
      const bodyHTML = await puppeteerToHtml(
        "https://www.atlasobscura.com/places?sort=likes_count"
      );
      return await parsePopularItems(bodyHTML);
    } catch (err) {
      console.log(err);
    }
  }

  async getPlaceById(placeId, placeOnly = true) {
    try {
      const response = await puppeteerToHtml(
        `https://www.atlasobscura.com/places/${placeId}.json${
          placeOnly ? `?place_only=true` : ``
        }`, true
      );

      const parsedData = JSON.parse(response);
      const withInfos = await puppeteerToHtml(parsedData.url);
      return await {
        ...parsedData,
        pictures: await parsePhotos(withInfos),
        text: await parseText(withInfos),
      };
    } catch (err) {
      console.log(err);
    }
  }

  async getPlaces({ city, country, orderByRecent = false }) {
    let items = [];
    const place = slugify(`${city} ${country}`);
    let placeUrl = `/things-to-do/${place}/places`;

    while (placeUrl !== undefined) {
      const placesBody = await puppeteerToHtml(`https://www.atlasobscura.com${placeUrl}${orderByRecent ? '?sort=recent': ''}`);
      items = [...items, ...(await parsePopularItems(placesBody))];
      placeUrl = getPaginationNextLink(placesBody);
    }
    return items;
  }

  async getFoodPlaces({ city, country }) {
    let items = [];
    const place = slugify(`${city} ${country}`);
    let placeUrl = `/cool-places-to-eat/${place}`;

    while (placeUrl !== undefined) {
      const placesBody = await puppeteerToHtml(`https://www.atlasobscura.com${placeUrl}`);
      items = [...items, ...(await parsePopularItems(placesBody))];
      placeUrl = getPaginationNextLink(placesBody);
    }
    return items;
  }

  async getPlacesRequest(placeUrl, orderByRecent) {
    try {
      const bodyHTML = await puppeteerToHtml(
        `https://www.atlasobscura.com${placeUrl}${orderByRecent ? '?sort=recent': ''}`
      );
      return await parsePopularItems(bodyHTML);
    } catch (err) {
      console.log(err);
    }
  }

  async getTags({ city, country }) {
    try {
      const place = slugify(`${city} ${country}`);
      let placeUrl = `/things-to-do/${place}`;
      const placeBody = await puppeteerToHtml(
        `https://www.atlasobscura.com${placeUrl}`
      );
      return await parseTags(placeBody);
    } catch (err) {
      console.log(err);
    }
  }

  async getPlacesByTag({ city, country, tag }) {
    try {
      const place = slugify(`${city} ${country}`);
      const tagUrl = slugify(tag, {
        customReplacements: [["&", " "]],
        remove: /[^\w\s$*_+~.()'"!\-:@€£]/g,
      });
      let placeUrl = `/tags/${tagUrl}/${place}`;
      const placeBody = await this.getPlacesRequest(placeUrl);
      return placeBody;
    } catch (err) {
      console.log(err);
    }
  }

  async search(keyword, isPlace = false) {
    try {
      const bodyHTML = await puppeteerToHtml(
        `https://www.atlasobscura.com/search?q=${keyword}${isPlace ? '&kind=places': ''}`
      );
      return await parseItems(bodyHTML);
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = AtlasObscura;
