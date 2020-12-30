// AIzaSyC_frEaiFuyJ2TqoQK9hpvWP6I14D7NNt8
//const RegistrationController = require('./RegistrationController')

CORS_PROXY_URL = "https://polar-bastion-78783.herokuapp.com/"
API_KEY = "AIzaSyC_frEaiFuyJ2TqoQK9hpvWP6I14D7NNt8";
RADIUS = 5000;
var allCards;



/**
 *
 */
function requestPlaces() {
    coords = localStorage['coords'] // get this dynamically from some form

    const requestData = {
        location: coords,
        type: "restaurant",
        opennow: "true",
        rankby: "distance",
        key: API_KEY,
    };

    const searchParams = new URLSearchParams(requestData);
    let requestUrl = `${CORS_PROXY_URL}https://maps.googleapis.com/maps/api/place/nearbysearch/json?${searchParams}`;


    $.get(requestUrl, function(data, status){
        
        console.log(data)
        let restaurants = data['results'].map(function(currentValue, index, arr) {
            let restaurantData = {
                name: currentValue['name'],
                photo: currentValue['photos'] ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1600&photoreference=${currentValue['photos'][0]['photo_reference']}&key=${API_KEY}` : "img_avatar1.png",
                price: currentValue['price_level'],
                rating: currentValue['rating'],
                vicinity: currentValue['vicinity'],
            }
            return restaurantData
        });
        // restaurants.map(function(restaurant) {
        //     console.log(restaurant);
        // })
        //
        let uniqueRestaurants = new Set()
        
        for (i = 0; i < restaurants.length; i++) {
            let restaurant = restaurants[i];
            if (uniqueRestaurants.has(restaurant["name"])) {
                continue
            }
            else {
                uniqueRestaurants.add(restaurant["name"])
                // console.log(restaurant["name"])
                var div = document.createElement("div");
                var img = document.createElement("img");
                div.className = "tinder--card";
                img.src = restaurant["photo"];
                // console.log(img.src)
                img.alt = "popeyes";
                var p = document.createElement("p");
                var name = document.createTextNode(restaurant["name"]);
                let object = {
                    "name" : restaurant["name"],
                    "value": 0,
                }
                // results[i] = object;
                results.push(object);
                console.log(results)
                p.appendChild(name);
                div.appendChild(p);
                div.appendChild(img);
                var element = document.getElementById("cards");
                element.appendChild(div);
                console.log(restaurant["name"])
            }
        }
        allCards = document.querySelectorAll('.tinder--card');
        initCards();
        allCardsFunction();
    });
    
}
