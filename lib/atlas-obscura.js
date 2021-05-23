const slugify = require("@sindresorhus/slugify");

const {
  parseItems,
  parseListItems,
  parsePopularItems,
  parseTags,
  getPaginationNextLink,
  parsePhotos,
  parseText,
  createNewPuppeteerInstance,
  puppeteerToHtml
} = require("./utils");

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

  async getAllPlaces() {
    try {
      const { browser, page } = await createNewPuppeteerInstance(
        "https://www.atlasobscura.com/articles/all-places-in-the-atlas-on-one-map"
      );

      let bodyHTML = await page.evaluate("AtlasObscura.all_places");
      await browser.close();

      return bodyHTML;
    } catch (err) {
      console.log(err);
    }
  }

  async getPlaceById(placeId, placeOnly = true) {
    try {
      const response = await puppeteerToHtml(
        `https://www.atlasobscura.com/places/${placeId}.json${
          placeOnly ? `?place_only=true` : ``
        }`,
        true
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
      const placesBody = await puppeteerToHtml(
        `https://www.atlasobscura.com${placeUrl}${
          orderByRecent ? "?sort=recent" : ""
        }`
      );
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
      const placesBody = await puppeteerToHtml(
        `https://www.atlasobscura.com${placeUrl}`
      );
      items = [...items, ...(await parsePopularItems(placesBody))];
      placeUrl = getPaginationNextLink(placesBody);
    }
    return items;
  }

  async getPlacesRequest(placeUrl, orderByRecent) {
    try {
      const bodyHTML = await puppeteerToHtml(
        `https://www.atlasobscura.com${placeUrl}${
          orderByRecent ? "?sort=recent" : ""
        }`
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
        `https://www.atlasobscura.com/search?q=${keyword}${
          isPlace ? "&kind=places" : ""
        }`
      );
      return await parseItems(bodyHTML);
    } catch (err) {
      console.log(err);
    }
  }

  async getUserLists(username) {
    try {
      const bodyHTML = await puppeteerToHtml(
        `https://www.atlasobscura.com/users/${username}/lists/`
      );
      return await parseListItems(bodyHTML);
    } catch (err) {
      console.log(err);
    }
  }

  async getUserList(username, listName, isExtended = false) {
    try {
      const bodyHTML = await puppeteerToHtml(
        `https://www.atlasobscura.com/users/${username}/lists/${listName}`
      );
      const parsedItems = await parseItems(bodyHTML);
      if(isExtended) {
        return await Promise.all(parsedItems.map(async (item) => {
          return await {...item, ...await this.getPlaceById(item.id)}
        }));
      }
      return parsedItems;
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = AtlasObscura;
