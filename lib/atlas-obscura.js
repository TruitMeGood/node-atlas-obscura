const axios = require('axios')
const slugify = require('@sindresorhus/slugify')

const { parseItems, getPaginationNextLink } = require('./utils')

class AtlasObscura {
	constructor() {
		this.request = axios.create({
			baseURL : 'https://www.atlasobscura.com'
		})
	}

	async getPopular() {
		try {
			const response = await this.request({
				method: 'GET',
				url: `/places`,
				params: {
					sort: 'likes_count'
				}
			})
			return await parseItems(response.data)
		} catch (err) {
			console.log(err)
		}
	}

	async getPlaceById(placeId, placeOnly = true) {
		try {
			const response = await this.request({
				method: 'GET',
				url: `/places/${placeId}.json`,
				params: placeOnly ? {
					place_only: 'true'
				} : {},
				responseType: 'json'
			})
			return response.data;
		} catch (err) {
			console.log(err)
		}
	}

	async getPlaces({
		city,
		country,
		orderByRecent = false
	}) {
		let items = []
		const place = slugify(`${city} ${country}`)
		let placeUrl = `/things-to-do/${place}/places`

		while(placeUrl !== undefined) {
			const placesBody = await this.getPlacesRequest(placeUrl, orderByRecent)
			items = [...items, ...await parseItems(placesBody)]
			placeUrl = getPaginationNextLink(placesBody)
		} 
		return items
	}

	async getPlacesRequest(placeUrl, orderByRecent) {
		try {
			const response = await this.request({
				method: 'GET',
				url: placeUrl,
				params: orderByRecent ? {
					sort: 'recent'
				} : {}
			})
			return response.data
		} catch (err) {
			console.log(err)
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
			})
 			return response.data
		} catch (err) {
			console.log(err)
		}
	}
}

module.exports = AtlasObscura