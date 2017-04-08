// GLOBAL VARIABLES
// =====================================================================================
var userLocation;
var cuisineChosen;
var businessImage = [];



// FUNCTIONS
// =====================================================================================
// Opening screen of app - asks user to input their location

function homeScreen() {
  var openingGreeting = $("<div>");
  openingGreeting.html("<h1 id ='opening-greeting'> What\'re you in the <span id='moodText2'> mood </span> for?</h1>");
  var locationForm = $("<form>");
  locationForm.attr("id", "location-form");
  locationForm.html("<input class='form-control' id='user-location' type='text' name='user-location' placeholder='zipcode or city'/>");
  var homeScreenSubmit = $("<button>");
  homeScreenSubmit.attr("class", "btn btn-default");
  homeScreenSubmit.attr("type", "submit");
  homeScreenSubmit.attr("id", "homeScreenSubmit");
  homeScreenSubmit.css({
    position: "absolute",
    right: "-5px",
    bottom: "0px"
  });

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
// The photos are then stored in the businessImages array
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
    // 'jsonpCallback' : 'cb',
    'cache': true
  }).done(function(data) {
      console.log(data);
      var businessId = [];
      for (var i = 0; i < 20; i++) {
        var result = data.businesses[i].id;
        var result2 = result.replace( /\-\d+$/, "");
        businessId.push(result2);
        console.log(businessId);
    }
    for (i = 0; i < businessId.length; i++){
      var parameters2 = [];
        parameters2.push(['oauth_consumer_key', auth.consumerKey]);
        parameters2.push(['oauth_consumer_secret', auth.consumerSecret]);
        parameters2.push(['oauth_token', auth.accessToken]);
        parameters2.push(['oauth_signature_method', 'HMAC-SHA1']);
        parameters2.push(['callback', 'cb']);
      var message2 = {
        'action': 'https://api.yelp.com/v2/business/' + businessId[i],
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
          // 'jsonpCallback' : 'cb',
          'cache': true
        }).done(function(response) {
          // need to store image value and replace "ms" in jpg to change with "l" or "o"
          var result = response.image_url;
          var result2 = result.replace("ms", "l");
          businessImage.push(result2);
          console.log(businessImage);
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
<<<<<<< HEAD
 // $("#main-section").empty();

 var foodImagesDiv = $("<div>");
  foodImagesDiv.attr("id", "food-images");
  $("#main-section").append(foodImagesDiv);

 imageCount = 0;
  var foodImage = $("<img>");
  foodImage.attr("id", "food-img");

 // console.log(businessImage[0])
  $("#main-section").empty();

  var foodImagesDiv = $("<div>");
  foodImagesDiv.attr("id", "food-images");
  $("#main-section").append(foodImagesDiv);

  imageCount = 0;
  var foodImage = $("<img>");
  foodImage.attr("id", "food-img");

  // console.log(businessImage[0]);
  foodImage.attr("src", "" + businessImage[imageCount] + "");
  foodImage.css({
    'width': '400px',
    'height': '400px'
  });
  $("#food-images").append(foodImage);


 // Creating like/dislike “buttons” as images with Bootstrap img-rounded class

  // Creating like/dislike "buttons" as images with Bootstrap img-rounded class

  // Need to add on-click event listener and cursor hover event
  var buttonsDiv = $("<div>");
  buttonsDiv.attr("id", "buttons-div");

<<<<<<< HEAD
 var imageCount = 0;

  var imageCount = 0;

  foodImage.attr("src", businessImage[imageCount]); // Or random index value?
  $("#food-images").append(foodImage);

 // Creating like & dislike “buttons” as images with Bootstrap img-rounded class
  // **Need to add on-click event listener for both buttons**
  var dislikeButton = $("<img>");
  dislikeButton.addClass("img-rounded");
  dislikeButton.attr("id", "dislike-btn");


 dislikeButton.attr("src", "assets/images/dislike-button.png");
  buttonsDiv.append(dislikeButton);

 var likeButton = $("<img>");
  likeButton.addClass("img-rounded");
  likeButton.attr("id", "like-btn");
  likeButton.attr("src", "assets/images/love-button.png");
  buttonsDiv.append(likeButton);
  $("#main-section").append(buttonsDiv);

}
// The below function dump the next photo into businessImage div whenever a user hit dislike button - the function gets the photos from businessImage array.
function nextPhoto() {
  $("#dislike-btn").on("click", function() {
      var index = 1;
      if (index >= businessImage.length) {
        index = 0;
      }
      else { 
        $("#food-images").empty();
        $("#food-images").append(businessImage[index]); 
        index++;
      }
  })// end of on-"click"
}// end of nextPhoto function.



  dislikeButton.attr("src", "assets/images/dislike-button.png");
  buttonsDiv.append(dislikeButton);


  var likeButton = $("<img>");
  likeButton.addClass("img-rounded");
  likeButton.attr("id", "like-btn");
  likeButton.attr("src", "assets/images/love-button.png");
  buttonsDiv.append(likeButton);
  $("#main-section").append(buttonsDiv);
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
$(document).on("click", "#get-started", function(event) {
  event.preventDefault();

  cuisineChosen = $('input[name=optradio]:checked').val();
  console.log(cuisineChosen);
  yelpSearch();
  timeId = setTimeout(showPhoto, 1000);
});
// If the user clicks the like button execute the ??? function
$(document).on("click", "#like-btn", function() {
  // Execute function for showing yelp restaurant info and google maps directions
});
// If the user clicks the dislike button, execute the nextPhoto function
$(document).on("click", "#dislike-btn", nextPhoto);
