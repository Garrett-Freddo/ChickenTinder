
CORS_PROXY_URL = "https://polar-bastion-78783.herokuapp.com/"
API_KEY = "AIzaSyC_frEaiFuyJ2TqoQK9hpvWP6I14D7NNt8";
RADIUS = 5000;

function getFinalPhotos() {
    let finalPhotos = gatherResultsFromDatabase(localStorage["groupCode"]).then(function(names) {
        const coords = localStorage['coords'];
        console.log("names", names)
        let photos;
        const requestData = {
            location: coords,
            type: "restaurant",
            opennow: "true",
            rankby: "distance",
            key: API_KEY,
        };
        const searchParams = new URLSearchParams(requestData);
        let requestUrl = `${CORS_PROXY_URL}https://maps.googleapis.com/maps/api/place/nearbysearch/json?${searchParams}`;
        $.ajax({
            url: requestUrl,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            type: "GET", /* or type:"GET" or type:"PUT" */
            dataType: "json",
            data: {
            },
            success: function(data, status){

                restaurantPhotos = {}
                for (var i = 0; i < data['results'].length; i++) {
                    let photo = data['results'][i]['photos'] ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1600&photoreference=${data['results'][i]['photos'][0]['photo_reference']}&key=${API_KEY}` : "img_avatar1.png";
                    let name = data["results"][i]['name']
                    if (names.includes(name)) {
                        console.log("curr photo", photo);
                        restaurantPhotos[name] = photo
                    }
                }
                photos = restaurantPhotos
                console.log("photos", photos)
                document.getElementById("photo1").src = photos[names[0]]
                document.getElementById("photo2").src = photos[names[1]]
                document.getElementById("photo3").src = photos[names[2]]
                document.getElementById("photo1-text").innerHTML += names[0]
                document.getElementById("photo2-text").innerHTML += names[1]
                document.getElementById("photo3-text").innerHTML += names[2]
            },
            error: function () {
                console.log("error");
            }
        });
    })
}
const temp = document.addEventListener("DOMContentLoaded", event => {
    getFinalPhotos() 
})

$("#refresh-button").click(async function () {
    getFinalPhotos();
})

