# node-atlas-obscura

An API Wrapper for Atlas Obscura

## Usage

```js
const Atlas = require('node-atlas-obscura')
const atlas = new Atlas()
```

### Get places in a city

```js
atlas.getPlaces({
    city: 'Berlin',
    country: 'Germany'
})
```

### Get place details

```js
atlas.getPlaceById(placeId, placeOnly = true)
/*
If false, this method will also return places nearby this one
*/
```
