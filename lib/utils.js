const cheerio = require('cheerio')

function parseItems(body) {
	let items = new Array()
    const $ = cheerio.load(body);

	return new Promise((resolve, reject) => {
        $('.content-card-text').each(function(i, element) {
            const place = {    
                id: $(element).parent('a').data('place-id'), 
                title: $(element).children('.content-card-title').text(),
                location: $(element).children('.place-card-location').text(),
                description: $(element).children('.content-card-subtitle').text(),
                url: 'http://www.atlasobscura.com' + $(element).parent('a').attr('href'),
                img: $(element).prev('figure').children().attr('data-src')
            }   
            items.push(place)
        });
        resolve(items)
	})
}

function getPaginationNextLink(body) {
    const $ = cheerio.load(body);
    const nextPageLink = $('.current').next('.page').find('a').attr('href')
    return nextPageLink
}

module.exports = {
    parseItems,
    getPaginationNextLink
}