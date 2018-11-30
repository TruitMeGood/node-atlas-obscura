const cheerio = require('cheerio')

function parseItems(body) {
	const items = []
    const $ = cheerio.load(body);

	return new Promise((resolve, reject) => {
        $('.content-card-text').each((i, element) => {
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

function parseTags(body) {
	const items = []
    const $ = cheerio.load(body);

	return new Promise((resolve, reject) => {
        $('.tag-pill').each((i, element) => {
            const tag = {    
                title: $(element).children('a').attr('title'),
                url: 'http://www.atlasobscura.com' + $(element).children('a').attr('href'),
                count: $(element).children('a').children('.tag-pill-count').text()
            }   
            items.push(tag)
        });
        resolve(items)
	})
}

function parseItinerary(body) {
    const items = []
    const $ = cheerio.load(body);

	return new Promise((resolve, reject) => {
        $('.trip-day-wrap').each((i, element) => {
            parseActivity($(element).children('ul')[0]).then(response => {
                const day = {    
                    illustration: $(element).children('.trip-day-figure').children('img').attr('src'),
                    title: $(element).children('.trip-day-body-num').text() + $(element).children('.trip-body-title').text(),
                    activities: response
                }   
                items.push(day)
            })
        });
        resolve({
            itinerary: items, 
            title: $('.item-title').text(), 
            location:{
                city: $('.item-supertitle').text().split(',')[0],
                country: $('.item-supertitle').text().split(',')[1].trim()
            }
        })
	})
}

function parseActivity(body) {
    const items = []
    const $ = cheerio.load(body);

	return new Promise((resolve, reject) => {
        $('li').each((i, element) => {
            const activity = {
                description: $(element).children('span').text(),
                place: $(element).children('a').length ? {
                    title: $(element).children('a').children('span').text(),
                    link: $(element).children('a').attr('href')
                } : null
                }
            items.push(activity)
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
    parseItinerary,
    parseTags,
    getPaginationNextLink
}