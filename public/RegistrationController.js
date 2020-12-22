let app;
let db;

const CONSTANTS = document.addEventListener("DOMContentLoaded", event => {
    app = firebase.app();
    db = firebase.firestore();
})

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
function logger() {
    console.log("kywin");
}