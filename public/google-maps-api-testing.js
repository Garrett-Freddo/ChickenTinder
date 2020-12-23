// AIzaSyC_frEaiFuyJ2TqoQK9hpvWP6I14D7NNt8
//const RegistrationController = require('./RegistrationController')

CORS_PROXY_URL = "https://cors-anywhere.herokuapp.com/"
API_KEY = "AIzaSyC_frEaiFuyJ2TqoQK9hpvWP6I14D7NNt8";
RADIUS = 5000;



/**
 *
 */
function requestPlaces() {

    ZIPCODE = 75019 // get this dynamically from some form
    zipcodeRequestURL = `https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyC_frEaiFuyJ2TqoQK9hpvWP6I14D7NNt8&components=postal_code:${ZIPCODE}`
    let lat = 0
    let lng = 0
    $.get(zipcodeRequestURL, function(data, status) {
        
        console.log(data);
        lat = data['results'][0]['geometry']['location']['lat'];
        lng = data['results'][0]['geometry']['location']['lng']
        console.log(lat + " " + lng);

        const requestData = {
        location: `${lat},${lng}`,
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
                    photo: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1600&photoreference=${currentValue['photos'][0]['photo_reference']}&key=${API_KEY}`,
                    price: currentValue['price_level'],
                    rating: currentValue['rating'],
                    vicinity: currentValue['vicinity'],
                }
                return restaurantData
            });
            restaurants.map(function(restaurant) {
                console.log(restaurant);
            })
            //

            for (i = 0; i < restaurants.length; i++) {
                let restaurant = restaurants[i];
                var div = document.createElement("div");
                var img = document.createElement("img");
                div.className = "tinder--card";
                img.src = restaurant["photo"];
                img.alt = "popeyes";
                var p = document.createElement("p");
                var name = document.createTextNode(restaurant["name"]);
                p.appendChild(name);
                div.appendChild(p);
                div.appendChild(img);
                var element = document.getElementById("cards");
                element.appendChild(div);
            }
        });
        
    })

    
}