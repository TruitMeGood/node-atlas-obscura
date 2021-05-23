const Atlas = require('./');
const atlas = new Atlas();

async function init() {
    /*const places = await atlas.getPlaces({
        city: "Berlin",
        country: "Germany",
        orderByRecent: true
    });*/
    /*const places = await atlas.getFoodPlaces({
        city: "Berlin",
        country: "Germany",
    });*/
    const places = await atlas.getUserList("jeremiezarca", "test", true);
    console.log(places);
}

init()