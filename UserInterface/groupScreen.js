// Get the modal
var modalIn = document.getElementById('id01');
var modalUp = document.getElementById('id02');
var zipcode = document.getElementById('zipcode');

function returnZipcode(){
    return zipcode;
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modalIn) {
        modalIn.style.display = "none";
    }else if(event.target == modalUp){
        modalUp.style.display = "none";
    }
}