

const fdsafsdaf = document.addEventListener("DOMContentLoaded", event => {
    let names = gatherResultsFromDatabase(localStorage["groupCode"])
    let photos;
    console.log(localStorage["groupCode"])
    gatherResultsFromDatabase(localStorage["groupCode"]).then(function(names) {
        photos = getInfoFromNames(names)
        console.log(photos)
    })
    


    
})


