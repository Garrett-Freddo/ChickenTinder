CORS_PROXY_URL = "https://polar-bastion-78783.herokuapp.com/"
API_KEY = "AIzaSyC_frEaiFuyJ2TqoQK9hpvWP6I14D7NNt8";
RADIUS = 5000;

function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
  }
  
  function showPosition(position) {
    localStorage['coords']  = position.coords.latitude +',' + position.coords.longitude;
    // alert(localStorage['coords']);
    console.log(localStorage["coords"])
  }

const temp = document.addEventListener("DOMContentLoaded", event => {
    getLocation();
})
    




$('.form').find('input, textarea').on('keyup blur focus', function (e) {
  
    var $this = $(this),
        label = $this.prev('label');
  
        if (e.type === 'keyup') {
              if ($this.val() === '') {
            label.removeClass('active highlight');
          } else {
            label.addClass('active highlight');
          }
      } else if (e.type === 'blur') {
          if( $this.val() === '' ) {
              label.removeClass('active highlight'); 
              } else {
              label.removeClass('highlight');   
              }   
      } else if (e.type === 'focus') {
        
        if( $this.val() === '' ) {
              label.removeClass('highlight'); 
              } 
        else if( $this.val() !== '' ) {
              label.addClass('highlight');
              }
      }
  
  });
  
  $('.tab a').on('click', function (e) {
    
    e.preventDefault();
    
    $(this).parent().addClass('active');
    $(this).parent().siblings().removeClass('active');
    
    target = $(this).attr('href');
  
    $('.tab-content > div').not(target).hide();
    
    $(target).fadeIn(600);
    
  });


  $("#create-group-btn").click(function () {
    getLocation();
    let groupCode = Math.random().toString(36).substring(7);
    let coords = localStorage["coords"]
    createRestaurantGroupWithCoords(groupCode, localStorage["coords"]);
    console.log("Coords: " + coords);
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
            
                let restaurants = data['results'].map(function(currentValue, index, arr) {     
                });
                restaurantNames = {}
                for (var i = 0; i < data['results'].length; i++) {
                    let name = data['results'][i]['name'];
                    restaurantNames[name] = 0
                }
                let dict = {
                    coords: coords,
                    ...restaurantNames
                }
                console.log("REST NAMES", restaurantNames);
                let res = db.collection('restaurantGroups').doc(groupCode).set(dict);
                joinGroup(groupCode);
            },
            error: function () {
                console.log("error");
            }
        });

})

$("#join-group-btn").click(function () {
    let groupCode = document.getElementById('group-code').value;
    let user =  db.collection('restaurantGroups').get().then((snapshot) => {
        let found;
        snapshot.docs.forEach(doc => {
            if(doc.id === groupCode){
                found = true
                joinGroup(groupCode);
            }
        })
        if(!found) {
            alert("Invalid Group code");
        }
    })
})