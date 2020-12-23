let app;
let db;

const CONSTANTS = document.addEventListener("DOMContentLoaded", event => {
    app = firebase.app();
    db = firebase.firestore();
})
/**
 * 
 * @param {String} firstName 
 * @param {*String} lastName 
 * @param {*String} email 
 * @param {*String} userName 
 * @param {*String} password 
 */
function addDataToFirestore(firstName, lastName, email, userName, password) {

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
    let res = db.collection('users').doc(firstName + lastName).set(data);
}

function createRestaurantGroup(restaurants, groupID) {
    let dict = {};
    restaurants.map((restaurant) => {
        dict[restaurant["name"]] = 0;
    });
    console.log("TAG HERE", dict);
    let res = db.collection('users').doc(groupID).set(dict);
}

