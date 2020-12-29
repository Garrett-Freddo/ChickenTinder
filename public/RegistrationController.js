let app;
let db;
let userDB;
let restaurantDB;
let increment = 0;

const CONSTANTS = document.addEventListener("DOMContentLoaded", event => {
    app          = firebase.app();
    db           = firebase.firestore();
    userDB       = db.collection('users');
    restaurantDB = db.collection('restaurantGroups');
})

CORS_PROXY_URL = "https://polar-bastion-78783.herokuapp.com/"
API_KEY = "AIzaSyC_frEaiFuyJ2TqoQK9hpvWP6I14D7NNt8";
RADIUS = 5000;

function getInfoFromNames(names) {
    console.log("names", names)
    zipcodeRequestURL = `https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyC_frEaiFuyJ2TqoQK9hpvWP6I14D7NNt8&components=postal_code:${localStorage["zipcode"]}`
    let lat = 0
    let lng = 0
    $.get(zipcodeRequestURL, function(data, status) {     
        lat = data['results'][0]['geometry']['location']['lat'];
        lng = data['results'][0]['geometry']['location']['lng']
        const requestData = {
            location: `${lat},${lng}`,
            radius: RADIUS,
            type: "restaurant",
            opennow: "true",
            key: API_KEY,
        };
        const searchParams = new URLSearchParams(requestData);
        let requestUrl = `${CORS_PROXY_URL}https://maps.googleapis.com/maps/api/place/nearbysearch/json?${searchParams}`;
        // let requestUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${searchParams}`
        console.log(lat + " " + lng)

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
                console.log("SUCCESS")
                return restaurantPhotos;
            },
            error: function () {
                console.log("error");
            }
        });
    })
}   


function recordResult(isLiked) {
    if(isLiked) {
        results[increment]["value"] = 1;
    } else {
        results[increment]["value"] = 0;
    }
    ++increment;
    console.log(results);
    if(increment === results.length-1) {
        addResultsToDatabase(results, localStorage["groupCode"]);
    }
}

async function gatherResultsFromDatabase(groupCode) {
    let document = await db.collection('restaurantGroups').doc(groupCode).get();
    let arrayContainer = [];
    let finalNumberarrayContainer =[];
    let namesArray = [];
    let found = false;
    if(document.exists) {
        let dict = document.data();
        for(let i in dict) {
            if (i != "zipcode") {
                arrayContainer.push(dict[i]);
            }
        }
        console.log("arraycontainer", arrayContainer)
        arrayContainer.sort()
        for(i = arrayContainer.length -1; i > arrayContainer.length -4; i--){
            finalNumberarrayContainer.push(arrayContainer[i]);
        }
        console.log("final", finalNumberarrayContainer)
        let foundSet = []
        for(i = 0; i < 3; ++i) {
            for(j in dict) {
                if(dict[j] === finalNumberarrayContainer[i] && !found){
                    if (!foundSet.includes(j)) {
                        namesArray.push(j);
                        foundSet.push(j)
                        break;
                    }
                }
            }
        }

        console.log("namesarray", namesArray)
        return namesArray;
    }
}

async function addResultsToDatabase(resultArray, groupCode) {
    let duplicates = [];
    console.log("results",resultArray);
    let document = await db.collection('restaurantGroups').doc(groupCode).get();
    if(document.exists) {
        let dict = document.data();
        console.log("originalDict", dict);
        resultArray.map( (i) => {
            if(!duplicates.includes(i['name'])){
                if(dict.hasOwnProperty(i['name'])){
                    dict[i['name']] += i['value'];
                } else {
                    dict[i['name']] = i['value'];
                }
                duplicates.push(i['name']);
            }
            
        });
        console.log("dict",dict);
        let res = db.collection('restaurantGroups').doc(groupCode).set(dict).then(function onSuccess(res) {
            window.location.href = "http://" + window.location.host + "/results.html";
        });
    }
}

// let doc = await db.collection('users').doc(localStorage['username']).get()
// if (doc.exists) {
//     let dict = doc.data()
//     dict['group'] = groupID
//     let res = db.collection('users').doc(localStorage['username']).set(dict);
//     localStorage['groupCode'] = groupID
// }
// else {
//     console.log("doc doesnt exist")
// }

/**
 * 
 * @param {String} firstName 
 * @param {String} lastName 
 * @param {String} email 
 * @param {String} userName 
 * @param {String} password 
 */
function addDataToFirestore(firstName, lastName, email, userName, password) {
    console.log("adding data");
    let ID = Math.floor((Math.random() * 100000) + 1).toString();
    let data = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        userName: userName,
        password: password,
        ID: ID,
        group: null,
    };
    let res = db.collection('users').doc(userName).set(data);
}

/**
 * Login and verify the user
 * @param {String} username 
 * @param {String} password 
 */
function isValidLoginInformation(username, password) {
    let found = false;
    let user =  userDB.get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            if(doc.id === username){
                if(doc.data().password === password){
                    found = true;
                    localStorage.removeItem("username")
                    localStorage["username"] = username;
                    window.location.href = "http://" + window.location.host + "/groupScreen.html";
                }
            }
        })
        if(!found) {
            alert("Invalid username/password");
        }
    })
}

/**
 * return true if all of the info is present and valid. Else return false.
 * @param {String} firstName 
 * @param {String} lastName 
 * @param {String} email 
 * @param {String} userName 
 * @param {String} password 
 * @returns Bool
 */
function isValidRegistrationInfo(firstName, lastName, email, userName, password) {
    let found = false;
    let user =  userDB.get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            if(doc.id === userName){
                found =  true;
            }
        })
        if(!found && firstName && lastName && email && password){
            addDataToFirestore(firstName, lastName, email, userName, password);
            alert("registered succesfully");
        } else {
            alert("invalid registration information");
        }
    })
}

/**
 * Check whether or not the username is in the database
 * @param {String} username 
 * @returns Bool
 */
function isUsernameInDatabase(username) {
    let user =  userDB.get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            if(doc.id === username){
                return true;
            }
        })
    })
}

function createRestaurantGroupWithZip(groupID, zipcode) {
    let dict = {
        zipcode: zipcode,
    }
    let res = db.collection('restaurantGroups').doc(groupID).set(dict); 
}

async function joinGroup (groupID) {
    let doc = await db.collection('users').doc(localStorage['username']).get()
    if (doc.exists) {
        let dict = doc.data()
        dict['group'] = groupID
        db.collection('users').doc(localStorage['username']).set(dict).then(async function onSuccess(res) {
            console.log(res)
            localStorage.removeItem("groupCode")
            localStorage["groupCode"] = groupID
            let groupDoc = await db.collection('restaurantGroups').doc(groupID).get()
            if (groupDoc.exists) {
                localStorage.removeItem("zipcode")
                localStorage["zipcode"] = groupDoc.data()["zipcode"]
                console.log(localStorage["zipcode"])
                window.location.href = "http://" + window.location.host + "/quiz.html";
            }
            else {
                console.log("group doesn't exist")
            }
           
        });
    }
    else {
        console.log("user doesnt exist")
    }
}

/**
 * Creates a restaurant group for a session in the database
 * @param {Object[]} restaurants 
 * @param {String} groupID 
 * @param {String} zipcode
 */

function createRestaurantGroup(restaurants, groupID, zipcode) {
    let dict = {};
    restaurants.map((restaurant) => {
        dict[restaurant["name"]] = 0;
    });
    console.log("TAG HERE", dict);
    dict["zipcode"] = zipcode;
    let res = db.collection('restaurantGroups').doc(groupID).set(dict);
}
function getLoginUsername() {
    let loginUsername = document.getElementById("loginUsername").value;        
    return loginUsername.toString();
}

function getLoginPassword() {
    let loginPassword = document.getElementById("loginPassword").value;
    return loginPassword.toString();
}

function getRegistrationPassword(){
    return document.getElementById("registerPassword").value;
}

function getRegistrationUsername(){
    return document.getElementById("registerUsername").value;
}

function getRegistrationFName(){
    return document.getElementById("registerFName").value;
}

function getRegistrationLName(){
    return document.getElementById("registerLName").value;
}

function getRegistrationEmail(){
    return document.getElementById("registerEmail").value;
}