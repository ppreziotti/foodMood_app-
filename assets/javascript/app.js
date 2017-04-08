// GLOBAL VARIABLES
// =====================================================================================
var userLocation;
var cuisineChosen;
var businessInfo = {
  businessName: [],
  businessImages: [],
  businessAddress: [],
  businessRating: [],
  businessReviewCount: [],
};
var imageCount = 0;
// FUNCTIONS
// =====================================================================================
// Opening screen of app - asks user to input their location
function homeScreen() {
  var openingGreeting = $("<div>");
  openingGreeting.html("<h1 id ='opening-greeting'> What\'re <i>you</i> in the <span id='moodText2'> mood </span> for?</h1>");
  var locationForm = $("<form>");
  locationForm.attr("id", "location-form");
  locationForm.html("<input class='form-control' id='user-location' type='text' name='user-location' placeholder='Enter your address to get started!'/>");
  var homeScreenSubmit = $("<button>");
  homeScreenSubmit.attr("class", "btn btn-default");
  homeScreenSubmit.attr("type", "submit");
  homeScreenSubmit.attr("id", "home-screen-submit");
  homeScreenSubmit.html("Submit");
  $("#main-section").append(locationForm);
  $("#main-section").append(openingGreeting);
  $("#location-form").append(homeScreenSubmit);
}

// Screen opened after the user inputs their location, lists cuisines types for the user to
// choose from
function openScreen() {
  var cuisineType = $("<div class='cuisine-type'>");
  cuisineType.html("<h1 class='cuisine-type'> What type of cuisine? </h1>");
  $("#main-section").append(cuisineType);
  var foodTypes = ["Italian", "Chinese", "Mediterranean", "Mexican", "Surprise Me"];
  var counter = 1;
  for(var i = 0; i < foodTypes.length; i++) {
    var foodDiv = $("<div>");
    foodDiv.attr("class", "radio");
    foodDiv.attr("id", "food-div" + counter);
    $(".cuisine-type").append(foodDiv);
    var foodList = $("<label>");
    foodList.attr("class", "food-list");
    foodList.html("<input value=" + foodTypes[i] + " " + "type='radio' name='optradio' class='food-value'>" + foodTypes[i]);
    $("#food-div"+ counter).append(foodList);
    counter++;
  }

  var getStarted = $("<p>");
  getStarted.attr("id", "get-started");
  getStarted.html("<a id='get-started-text'>Submit</a>");
  $("#food-div" + 5).append(getStarted);
}

// Pulls photos from the Yelp API based on the user's location and desired cuisine type
// The photos are then stored in the businessInfos array
function yelpSearch() {
  var queryURL = 'https://api.yelp.com/v2/search';
  var auth= {
    consumerKey: 'auktxeLEVeqlzAMSmT6CzQ',
    consumerSecret: 'kGoz9Jmvzxwuu3FiTvyhgbkRkaI',
    accessToken: 'JCT1veuw5aGAVPpGKeHyEqY-m4b1Om5k',
    accessTokenSecret: 'B5fgXIsqZ--6_cTGZb356yPiiSc',
    serviceProvider: {
      signatureMethod: "HMAC-SHA1"
    }
  };
  var accessor = {
    consumerSecret: auth.consumerSecret,
    tokenSecret: auth.accessTokenSecret
  };
  var parameters = [];
    parameters.push(['term', cuisineChosen]);
    parameters.push(['location', userLocation]);
    parameters.push(['oauth_consumer_key', auth.consumerKey]);
    parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
    parameters.push(['oauth_token', auth.accessToken]);
    parameters.push(['oauth_signature_method', 'HMAC-SHA1']);
    parameters.push(['callback', 'cb']);
  var message = {
    'action': 'https://api.yelp.com/v2/search',
    'method': 'GET',
    'parameters': parameters
  };
  // console.log(message.action);
  OAuth.setTimestampAndNonce(message);
  OAuth.SignatureMethod.sign(message, accessor);
  var parameterMap = OAuth.getParameterMap(message.parameters);
  parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature);
  // console.log(parameterMap);
  $.ajax({
    'url' : message.action,
    'data' : parameterMap,
    'dataType' : 'jsonp',
    // 'timeout': '1000',
    'cache': true
  }).done(function(data) {
      console.log(data);
      var businessName = [];
      for (var i = 0; i < 10; i++) {
        var result = data.businesses[i].id;
        // var result2 = result.replace( /\-\d+$/, "");
        businessName.push(result);
        console.log(businessName);
    }
    var counter = 1;
    for (i = 0; i < businessName.length; i++){
      var parameters2 = [];
        parameters2.push(['oauth_consumer_key', auth.consumerKey]);
        parameters2.push(['oauth_consumer_secret', auth.consumerSecret]);
        parameters2.push(['oauth_token', auth.accessToken]);
        parameters2.push(['oauth_signature_method', 'HMAC-SHA1']);
        parameters2.push(['callback', 'cb']);
      var message2 = {
        'action': 'https://api.yelp.com/v2/business/' + businessName[i],
        'method': 'GET',
        'parameters': parameters2
      };
      OAuth.setTimestampAndNonce(message2);
      OAuth.SignatureMethod.sign(message2, accessor);
      var parameterMap2 = OAuth.getParameterMap(message2.parameters);
      parameterMap2.oauth_signature =
      OAuth.percentEncode(parameterMap2.oauth_signature);
        $.ajax({
          'url': message2.action,
          'data': parameterMap2,
          'dataType' : 'jsonp',
          'timeout': '1000',
          'cache': true
        }).done(function(response) {
          // need to store image value and replace "ms" in jpg to change with "l" or "o"
          var businessName = response.name;
          var customerImage = response.image_url;
          var customerImageL = customerImage.replace(/[^\/]+$/,'o.jpg');
          var yelpAddress = response.location.address;
          var businessRating = response.rating_img_url;
          var businessReviewCount = response.review_count;
          businessInfo.businessName.push(businessName);
          businessInfo.businessImages.push(customerImageL);
          businessInfo.businessAddress.push(yelpAddress);
          businessInfo.businessRating.push(businessRating);
          businessInfo.businessReviewCount.push(businessReviewCount);
          console.log(businessInfo);
          console.log(response.menu_provider);
          counter++;
        }).fail(function(jqXHR, textStatus, errorThrown) {
          console.log(errorThrown);
          console.log("text status: + " + textStatus);
        });
      }
      }).fail(function(jqXHR, textStatus, errorThrown) {
      console.log('error[' + errorThrown + '], status[' + textStatus + '], jqXHR[' + JSON.stringify(jqXHR) + ']');
  });
}

// Displays a photo of a restuarant's food from the businessImages array along with like &
// dislike buttons
function showPhoto() {
  $("#main-section").empty();

  var foodImagesDiv = $("<div>");
  foodImagesDiv.attr("id", "food-images");
  // foodImagesDiv.css({
  //   'marginRight': '60%',
  //   'position': 'relative',
  //   'backgroundColor': 'white',
  //   'width': '650px',
  //   'height': '500px'
  // });
  $("#main-section").append(foodImagesDiv);

  var foodImage = $("<img>");
  foodImage.attr("id", "food-img");
  foodImage.attr("src", businessInfo.businessImages[imageCount]);
  // foodImage.css({
  //   'position': 'relative',
  //
  //   'width': '300px',
  //   'height': '300px',
  //   'backgroundImage': 'cover'
  // });
  $("#food-images").append(foodImage);
  console.log(businessInfo.businessAddress[imageCount]);

  // Adding Yelp logo/link to Yelp to image in order to comply with Yelp API display requirements
  var yelpLink = $("<a>");
  yelpLink.attr("href", "http://www.yelp.com");
  yelpLink.attr("target", "_blank");
  var yelpLogo = $("<img>");
  yelpLogo.attr("id", "yelp-logo");
  yelpLogo.attr("src", "assets/images/Yelp_trademark_RGB_outline.png");
  yelpLogo.attr("alt", "Yelp Logo");
  yelpLink.append(yelpLogo);
  $("#food-images").append(yelpLink);

  // Creating like/dislike "buttons" as images with Bootstrap img-rounded class
  // Need to add on-click event listener and cursor hover event
  var buttonsDiv = $("<div>");
  buttonsDiv.attr("id", "buttons-div");

  // Creating like & dislike "buttons" as images with Bootstrap img-rounded class
  // **Need to add on-click event listener for both buttons**
  var dislikeButton = $("<img>");
  dislikeButton.addClass("img-rounded");
  dislikeButton.attr("id", "dislike-btn");

  dislikeButton.attr("src", "assets/images/dislike-button3.png");
  buttonsDiv.append(dislikeButton);

  var likeButton = $("<img>");
  likeButton.addClass("img-rounded");
  likeButton.attr("id", "like-btn");
  likeButton.attr("src", "assets/images/like-button2.png");
  buttonsDiv.append(likeButton);
  $("#main-section").append(buttonsDiv);

}

function nextPhoto() {
  imageCount++;
  if (imageCount >= businessInfo.businessImages.length) {
    imageCount = 0;
  }
  else {
    showPhoto();
    console.log(imageCount);
  }
}

function lovePhoto() {
  $("#like-btn").hide();
  $("#dislike-btn").hide();
  $("#food-images").hide();
  console.log('test');
  getDirections();
}

// Uses Google Maps Embed API to display directions from the user's current location
// to the desired restaurant
function getDirections() {
  var lovePhotoDiv = $("<div>");
  lovePhotoDiv.attr("id", "love-photo");

  var apiKey = "AIzaSyDUxezpr4WRRo7HEPE-HgmQ4WYCexWVdQs";
  var origin = userLocation;
  var destination = businessInfo.businessAddress[imageCount];
  var queryURL = "https://www.google.com/maps/embed/v1/directions?key=" + apiKey +
    "&origin=" + origin + "&destination=" + destination;
  var mapDisplay = $("<iframe>");
  // added Id to allow for positioning of iframe
  mapDisplay.attr("id", "google-maps");
  mapDisplay.attr("src", queryURL);
  mapDisplay.attr("width", "500");
  mapDisplay.attr("height", "400");
  mapDisplay.attr("frameborder", "0");
  mapDisplay.attr("style", "border:0");
  lovePhotoDiv.append(mapDisplay);

  $("#main-section").append(lovePhotoDiv);
}

// MAIN PROCESS
// ==========================================================================================

// Open the home screen immediately
homeScreen();

// Click event handler for the home-screen-submit button, assigns the user's location and
// desired cuisine type to variables to be used in the yelpSearch function, then executes
// the openScreen function
$(document).on("click", "#home-screen-submit", function(event) {
  event.preventDefault();
  userLocation = $("#user-location").val().trim();
  $("#user-location").val("");
  console.log(userLocation);
  $("#main-section").empty();
  openScreen();
});

// After the user chooses a cuisine type and clicks the get started button, the yelpSearch
// function is executed without reloading the page
$(document).one("click", "#get-started", function(event) {
  event.preventDefault();

  cuisineChosen = $('input[name=optradio]:checked').val();
  console.log(cuisineChosen);
  yelpSearch();
  $(document).ajaxStop(function() {
    showPhoto();
  });
});

// If the user clicks the like button execute the ??? function
$(document).on("click", "#like-btn", lovePhoto);
  // Execute function for showing yelp restaurant info and google maps directions

// If the user clicks the dislike button, execute the nextPhoto function
$(document).on("click", "#dislike-btn", nextPhoto);

// // If the user clicks the dislike button, execute the nextPhoto function
// $(document).on("click", "#dislike-btn", nextPhoto);
$(document).on("click","#dislike-btn", nextPhoto);
