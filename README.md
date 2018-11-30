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
    orderByRecent = false
})
/*
If true, this method will show most recent places added for this location
*/
```

### Get place details

```js
atlas.getPlaceById(placeId, placeOnly = true)
/*
If false, this method will also return places nearby this one
*/
```

### Get tags for a city

```js
atlas.getTags({
    city: 'Berlin',
    country: 'Germany'
})
```

### Get places by tag

```js
atlas.getPlacesByTag({
    city: 'Berlin',
    country: 'Germany'
}, 'art')
```

### Get most popular places

```js
atlas.getPopular()
```

### Search by keyword

```js
atlas.search(keyword)
```
