CORS_PROXY_URL = "https://polar-bastion-78783.herokuapp.com/"
API_KEY = "AIzaSyC_frEaiFuyJ2TqoQK9hpvWP6I14D7NNt8";
RADIUS = 5000;

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
    let zipcode = document.getElementById('zipcode').value;
    let groupCode = Math.random().toString(36).substring(7);
    createRestaurantGroupWithZip(groupCode, zipcode);
    console.log(zipcode);

    zipcodeRequestURL = `https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyC_frEaiFuyJ2TqoQK9hpvWP6I14D7NNt8&components=postal_code:${zipcode}`
    let lat = 0
    let lng = 0
    localStorage['zipcode'] = zipcode
    $.get(zipcodeRequestURL, function(data, status) {     
        lat = data['results'][0]['geometry']['location']['lat'];
        lng = data['results'][0]['geometry']['location']['lng']
        console.log(lat, "   ", lng);
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
            
                let restaurants = data['results'].map(function(currentValue, index, arr) {
                    
                });
                restaurantNames = {}
                for (var i = 0; i < data['results'].length; i++) {
                    let name = data['results'][i]['name'];
                    restaurantNames[name] = 0
                }
                let dict = {
                    zipcode: zipcode,
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

    console.log("FSAFAFA");
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