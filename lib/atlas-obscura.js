const axios = require('axios');
const slugify = require('@sindresorhus/slugify');

const {
  parseItems,
  parseTags,
  getPaginationNextLink,
  parsePhotos
} = require('./utils');

class AtlasObscura {
  constructor() {
    this.request = axios.create({
      baseURL: 'https://www.atlasobscura.com'
    });
  }

  async getPopular() {
    try {
      const response = await this.request({
        method: 'GET',
        url: `/places`,
        params: {
          sort: 'likes_count'
        }
      });
      return await parseItems(response.data);
    } catch (err) {
      console.log(err);
    }
  }

  async getPlaceById(placeId, placeOnly = true) {
    try {
      const response = await this.request({
        method: 'GET',
        url: `/places/${placeId}.json`,
        params: placeOnly
          ? {
              place_only: 'true'
            }
          : {},
        responseType: 'json'
      });
      const withPictures = await this.request({
        method: 'GET',
        url: response.data.url
      });
      return await {
        ...response.data,
        pictures: await parsePhotos(withPictures.data)
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
      const placesBody = await this.getPlacesRequest(placeUrl, orderByRecent);
      items = [...items, ...(await parseItems(placesBody))];
      placeUrl = getPaginationNextLink(placesBody);
    }
    return items;
  }

  async getPlacesRequest(placeUrl, orderByRecent) {
    try {
      const response = await this.request({
        method: 'GET',
        url: placeUrl,
        params: orderByRecent
          ? {
              sort: 'recent'
            }
          : {}
      });
      return response.data;
    } catch (err) {
      console.log(err);
    }
  }

  async getTags({ city, country }) {
    try {
      const place = slugify(`${city} ${country}`);
      let placeUrl = `/things-to-do/${place}`;
      const placeBody = await this.getPlacesRequest(placeUrl);
      return await parseTags(placeBody);
    } catch (err) {
      console.log(err);
    }
  }

  async getPlacesByTag({ city, country }, tag) {
    try {
      const place = slugify(`${city} ${country}`);
      const tagUrl = slugify(tag, {
        customReplacements: [['&', ' ']],
        remove: /[^\w\s$*_+~.()'"!\-:@€£]/g
      });
      let placeUrl = `/tags/${tagUrl}/${place}`;
      const placeBody = await this.getPlacesRequest(placeUrl);
      return await parseItems(placeBody);
    } catch (err) {
      console.log(err);
    }
  }

  async search(keyword) {
    try {
      const response = await this.request({
        method: 'GET',
        url: `/search/combined`,
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        },
        params: {
          q: keyword
        }
      });
      return response.data;
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = AtlasObscura;
