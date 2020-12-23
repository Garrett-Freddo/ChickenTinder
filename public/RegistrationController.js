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
    if(username && password) {
        if(username.length > 3 && password.length > 3) {
            let user =  userDB.get().then((snapshot) => {
                snapshot.docs.forEach(doc => {
                    if(doc.id === username){
                        if(doc.data().password === password){
                            return true;
                        }
                    }
                })
            })
        }
    }
    return false;
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
    if(firstName && lastName && email && userName && password){
        if(userName.length > 3 && password.length > 3) {
            if(!isUsernameInDatabase(userName)){
                addDataToFirestore(firstName, lastName, email, userName, password);
            }
        }
    }
    console.log("rejected");
    return false;
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
 */
function createRestaurantGroup(restaurants, groupID) {
    let dict = {};
    restaurants.map((restaurant) => {
        dict[restaurant["name"]] = 0;
    });
    console.log("TAG HERE", dict);
    let res = db.collection('restaurantGroups').doc(groupID).set(dict);
}

