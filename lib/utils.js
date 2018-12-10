const cheerio = require('cheerio');

function parseItems(body) {
  const items = [];
  const $ = cheerio.load(body);

  return new Promise((resolve, reject) => {
    $('.content-card-text').each((i, element) => {
      const place = {
        id: $(element)
          .parent('a')
          .data('place-id'),
        title: $(element)
          .children('.content-card-title')
          .text(),
        location: $(element)
          .children('.place-card-location')
          .text(),
        description: $(element)
          .children('.content-card-subtitle')
          .text(),
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
      .children('p')
      .each((i, element) => {
        items.push(element.firstChild.data);
      });
    resolve(items);
  });
}

module.exports = {
  parseItems,
  parseTags,
  parsePhotos,
  parseText,
  getPaginationNextLink
};
