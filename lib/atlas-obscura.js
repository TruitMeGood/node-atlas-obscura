const axios = require('axios')
const slugify = require('@sindresorhus/slugify');

const { parseItems } = require('./utils')

class AtlasObscura {
	constructor() {
		this.request = axios.create({
			baseURL : 'https://www.atlasobscura.com'
		})
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
	}) {
		try {
			const place = slugify(`${city} ${country}`)
			const response = await this.request({
				method: 'GET',
				url: `/things-to-do/${place}/places`
			})

			const body = response.data
			//return body;
			return await parseItems(body)
		} catch (err) {
			console.log(err)
		}
	}
}

module.exports = AtlasObscura