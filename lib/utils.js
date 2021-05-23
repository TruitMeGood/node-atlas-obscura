const cheerio = require('cheerio');

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
  parsePopularItems,
  parseTags,
  parsePhotos,
  parseText,
  getPaginationNextLink
};
