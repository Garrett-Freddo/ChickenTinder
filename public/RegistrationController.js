let app;
let db;
let userDB;

const CONSTANTS = document.addEventListener("DOMContentLoaded", event => {
    app    = firebase.app();
    db     = firebase.firestore();
    userDB = db.collection('users');
})

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