// AIzaSyC_frEaiFuyJ2TqoQK9hpvWP6I14D7NNt8
ZIPCODE = 75019
CORS_PROXY_URL = "https://cors-anywhere.herokuapp.com/"

zipcodeRequestURL = `https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyC_frEaiFuyJ2TqoQK9hpvWP6I14D7NNt8&components=postal_code:${ZIPCODE}`
let lat = 0
let lng = 0
$.get(zipcodeRequestURL, function(data, status) {
    console.log(data);
    lat = data['results'][0]['geometry']['location']['lat'];
    lng = data['results'][0]['geometry']['location']['lng']
    console.log(lat + " " + lng);
})


API_KEY = "AIzaSyC_frEaiFuyJ2TqoQK9hpvWP6I14D7NNt8";
RADIUS = 5000;
const requestData = {
    location: "32.9670,-96.9853",
    radius: RADIUS,
    type: "restaurant",
    opennow: "true",
    key: API_KEY,
};
  
const searchParams = new URLSearchParams(requestData);
let requestUrl = `${CORS_PROXY_URL}https://maps.googleapis.com/maps/api/place/nearbysearch/json?${searchParams}`;

$.get( requestUrl, function(data, status){
    console.log(data)
    let restaurants = data['results'].map(function(currentValue, index, arr) {
        let restaurantData = {
            name: currentValue['name'],
            photo: currentValue['photos'][0]['html_attributions'][0],
            price: currentValue['price_level'],
            rating: currentValue['rating'],
            vicinity: currentValue['vicinity'],
        }
        return restaurantData
    });
    restaurants.map(function(restaurant) {
        console.log(restaurant);
    })
    
  });