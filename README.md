# node-atlas-obscura

An API Wrapper for Atlas Obscura

## Installation

```
npm install --save node-atlas-obscura
```

## Usage

```js
const Atlas = require("node-atlas-obscura");
const atlas = new Atlas();
```

### Get places in a city

```js
atlas.getPlaces({
  city: "Berlin",
  country: "Germany",
  orderByRecent: false,
});
/*
If true, this method will show most recent places added for this location
*/
```

### Get food places in a city

```js
atlas.getFoodPlaces({
  city: "Berlin",
  country: "Germany",
});
```

### Get place details

```js
atlas.getPlaceById(placeId, (placeOnly = true));
/*
If false, this method will also return places nearby this one
*/
```

### Get tags for a city

```js
atlas.getTags({
  city: "Berlin",
  country: "Germany",
});
```

### Get places by tag

```js
atlas.getPlacesByTag({
  city: "Berlin",
  country: "Germany",
  tag: "art",
});
```

### Get most popular places

```js
atlas.getPopular();
```

### Get all places

```js
atlas.getAllPlaces();
```

### Search by keyword

```js
atlas.search(keyword, isPlace = false);
```
