// //FACEBOOK INTEGRATION
// //====================================================================================
// function statusChangeCallback(response) {
//   console.log('statusChangeCallback');
//   console.log(response);
//   // The response object is returned with a status field that lets the
//   // app know the current login status of the person.
//   // Full docs on the response object can be found in the documentation
//   // for FB.getLoginStatus().
//   if (response.status === 'connected') {
//     // Logged into your app and Facebook.
//     testAPI();
//   } else {
//     // The person is not logged into your app or we are unable to tell.
//     document.getElementById('status').innerHTML = 'Please log ' +
//       'into this app.';
//   }
// }
//
// // This function is called when someone finishes with the Login
// // Button.  See the onlogin handler attached to it in the sample
// // code below.
// function checkLoginState() {
//   FB.getLoginStatus(function(response) {
//     statusChangeCallback(response);
//   });
// }
//
// window.fbAsyncInit = function() {
// FB.init({
//   appId      : '1678163075543673',
//   cookie     : true,  // enable cookies to allow the server to access
//                       // the session
//   xfbml      : true,  // parse social plugins on this page
//   version    : 'v2.8' // use graph api version 2.8
// });
//
// // Now that we've initialized the JavaScript SDK, we call
// // FB.getLoginStatus().  This function gets the state of the
// // person visiting this page and can return one of three states to
// // the callback you provide.  They can be:
// //
// // 1. Logged into your app ('connected')
// // 2. Logged into Facebook, but not your app ('not_authorized')
// // 3. Not logged into Facebook and can't tell if they are logged into
// //    your app or not.
// //
// // These three cases are handled in the callback function.
//
// FB.getLoginStatus(function(response) {
//   statusChangeCallback(response);
// });
//
// };
//
// // Load the SDK asynchronously
// (function(d, s, id) {
//   var js, fjs = d.getElementsByTagName(s)[0];
//   if (d.getElementById(id)) return;
//   js = d.createElement(s); js.id = id;
//   js.src = "https://connect.facebook.net/en_US/sdk.js";
//   fjs.parentNode.insertBefore(js, fjs);
// }(document, 'script', 'facebook-jssdk'));
//
// // Here we run a very simple test of the Graph API after login is
// // successful.  See statusChangeCallback() for when this call is made.
// function testAPI() {
//   console.log('Welcome!  Fetching your information.... ');
//   FB.api('/me', function(response) {
//     console.log(response);
//     console.log('Successful login for: ' + response.name);
//     document.getElementById('status').innerHTML =
//       'Thanks for logging in, ' + response.name + '!';
//       userName = response.name.split(/[ ,]+/);
//       userName2 = userName[0];
//   });
// }
//

// GLOBAL VARIABLES
// =====================================================================================
var userName2 = "";
var userLocation;
var cuisineChosen;
var businessInfo = {
  businessName: [],
  businessId: [],
  businessImages: [],
  businessAddress: [],
  businessRating: [],
  businessReviewCount: [],
};
var lovePhotoDiv;
var cuisinePicked = false;
var imageCount = 0;
var lovePhotoDiv;

// FUNCTIONS
// =====================================================================================
// Opening screen of app - asks user to input their location
function validation(userLocation) {
   if (userLocation.length === 5) {
        for( var i = 0; i < 5; i++) {
          if (userLocation.charCodeAt(i) >= 48 && userLocation.charCodeAt(i) <= 57) {
            console.log("it is a zip code");
        }// end if
        else if ((userLocation.charCodeAt(i) >= 65 && userLocation.charCodeAt(i) <= 90) || (userLocation.charCodeAt(i) >= 97 && userLocation.charCodeAt(i) <= 121) ){
          console.log("It is a city");
        } // end else of
        else {
          console.log("it is not a zip code or a city");
          break;
        }// end else
      }//end for
    }// end if
}// end function

// Initialize Firebase
 var config = {
   apiKey: "AIzaSyDSBv8dJ2nzh0mfhCLEoba_wioPc2FfqcA",
   authDomain: "contact-us-cb646.firebaseapp.com",
   databaseURL: "https://contact-us-cb646.firebaseio.com",
   projectId: "contact-us-cb646",
   storageBucket: "contact-us-cb646.appspot.com",
   messagingSenderId: "73152289846"
 };
 firebase.initializeApp(config);

 var database = firebase.database();


// 2. Button for adding new user
$("#submit-msg").on("click", function(event) {
 event.preventDefault();

 // Grabs train input
 var name = $("#user-name").val().trim();
 var email = $("#user-email").val().trim();
 var message = $("#user-msg").val().trim();

 //Creates local object for holding user's data
 var newUser = {
   userName: name,
   userEmail: email,
   userMessage: message
 };

 database.ref().push(newUser);

  $("#user-name").val("");
  $("#user-email").val("");
  $("#user-msg").val("");

 // Prevents moving to new page
 return false;
});

$("input").keyup(function() {
     if ($(".form-control").val() !== "") {
       $("#home-screen-submit").removeAttr("disabled");
     }
     else {
       $("#home-screen-submit").attr("disabled","disabled");
     }
   });

// showing contact us form
function div_show() {
     document.getElementById("contact-us-form").style.display = "block";
   }

// Hiding contact us form.
function div_hide() {
     document.getElementById("contact-us-form").style.display = "none";
   }

function homeScreen() {
  var openingGreeting = $("<div>");
  openingGreeting.html("<h1 id ='opening-greeting'> What are you in the <span id='mood-text2'><i> mood </i></span> for?</h1>");

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
  businessInfo = {
    businessName: [],
    businessId: [],
    businessImages: [],
    businessAddress: [],
    businessRating: [],
    businessReviewCount: [],
  };


  var cuisineType = $("<div class='cuisine-type'>");
  cuisineType.html("<h1 id='cuisine-header' class='cuisine-type'> What type of cuisine " + userName2 + "? </h1>");
  $("#main-section").append(cuisineType);
  var foodTypes = ["Italian", "Chinese", "Mediterranean", "Mexican", "Indian", "Sushi"];
  var counter = 1;
  for(var i = 0; i < foodTypes.length; i++) {
    var foodList = $("<label>");
    foodList.attr("class", "food-list radio");
    foodList.attr("id", "food-list" + counter);
    foodList.html("<input value=" + foodTypes[i] + " " + "type='radio' name='optradio' class='food-value'>" + foodTypes[i]);
    $("#cuisine-header").append(foodList);
    counter++;
  }

  var getStarted = $("<p>");
  getStarted.attr("id", "get-started");
  getStarted.html("<a id='get-started-text'>Submit</a>");
  $("#cuisine-header").append(getStarted);
}

// Pulls photos from the Yelp API based on the user's location and desired cuisine type
// The photos are then stored in the businessInfos array
function yelpSearch() {
  var queryURL = 'https://api.yelp.com/v2/search';
  //authentication object containing necessary headers for server authentication
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
      // second ajax call using the business ids captured in the first ajax call to pull business info(business images,
      // user-uploaded images, business address, business rating and review count)
        $.ajax({
          'url': message2.action,
          'data': parameterMap2,
          'dataType' : 'jsonp',
          'timeout': '1500',
          'cache': true
        }).done(function(response) {
          // need to store image value and replace "ms" in jpg to change with "l" or "o"
          console.log (businessInfo);
          var businessName = response.name;
          var customerImage = response.image_url;
          var customerImageL = customerImage.replace(/[^\/]+$/,'o.jpg');
          var yelpAddress = response.location.address;
          var businessRating = response.rating_img_url;
          var businessReviewCount = response.review_count;
          var businessId = response.id;

          businessInfo.businessId.push(businessId);
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
  $("#main-section").append(foodImagesDiv);

  var foodImage = $("<img>");
  foodImage.attr("id", "food-img");
  foodImage.attr("class", "well well-lg");
  foodImage.attr("src", businessInfo.businessImages[imageCount]);
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

  lovePhotoDiv = $("<div>");
  lovePhotoDiv.attr("id", "love-photo");

  var yelpInfoDiv = $("<div>");
  yelpInfoDiv.attr("class", "yelp-info-div");


  var businessDisplay = $("<h1>").html(businessInfo.businessName[imageCount]);
  var ratingImage = $("<img>");
  ratingImage.attr("src", businessInfo.businessRating[imageCount]);
  ratingImage.attr("alt", "Yelp Rating");
  var yelpLink2 = $("<a>").attr("href", "https://www.yelp.com/biz/" + businessInfo.businessId[imageCount]);
  yelpLink2.attr("target", "_blank");
  var yelpLogo2 = $("<img>");
  // Need to link Yelp page!!!!
  yelpLogo2.attr("src", "assets/images/Yelp_trademark_RGB_outline.png");
  yelpLogo2.attr("alt", "Yelp Logo");
  yelpLogo2.attr("id", "yelp-logo-2");
  yelpLink2.append(yelpLogo2);
  var ratingDisplay = $("<h2>");
  ratingDisplay.append(ratingImage);
  ratingDisplay.append(yelpLink2);
  var reviewCount = businessInfo.businessReviewCount[imageCount];
  var reviewCountDisplay = $("<h3>").html("Based on " + reviewCount + " reviews");

  yelpInfoDiv.append(businessDisplay);
  yelpInfoDiv.append(ratingDisplay);
  yelpInfoDiv.append(reviewCountDisplay);
  lovePhotoDiv.append(yelpInfoDiv);

  var chooseAnother = $("<div>");
  chooseAnother.attr("id", "chooseAnother");
  chooseAnother.text("Still not satisfied?");
  lovePhotoDiv.append(chooseAnother);

  var returnButton = $("<button>");
  returnButton.attr("id", "return-btn");
  returnButton.attr("class", "btn btn-default");
  returnButton.attr("type", "submit");
  returnButton.html("Choose another restaurant");
  lovePhotoDiv.append(returnButton);

  var startOverButton = $("<button>").text("Pick a New Cuisine");
  startOverButton.addClass("btn btn-default");
  startOverButton.attr("id", "start-over-btn");
  lovePhotoDiv.append(startOverButton);

  // returns getDirections() which triggers google API directions search and embed
  getDirections();

  $("#main-section").append(lovePhotoDiv);
}

function returnScreen() {
  // need to append a button to lovePhoto() screen to return to previous screen
  // 1) need to hide lovePhoto screen and return-btn 2) unhide #like-btn, #dislike-btn and #food-images div
  // ensure functionality between screens and nextPhoto and lovePhoto functions on button clicks after returning
  $("#love-photo").hide();
  $("#return-btn").hide();
  $("#like-btn").show();
  $("#dislike-btn").show();
  $("#food-images").show();
}

// Uses Google Maps Embed API to display directions from the user's current location, captured on 1st submit button click,
// to the desired restaurant
function getDirections() {
  var apiKey = "AIzaSyDUxezpr4WRRo7HEPE-HgmQ4WYCexWVdQs";
  var origin = userLocation;
  var destination = businessInfo.businessAddress[imageCount];
  var queryURL = "https://www.google.com/maps/embed/v1/directions?key=" + apiKey +
    "&origin=" + origin + "&destination=" + destination;
  var mapDisplay = $("<iframe>");
  // bootstrap class to create a encompassing panel around an element
  mapDisplay.attr("class", "well well-lg");
  // added Id to allow for positioning of iframe
  mapDisplay.attr("id", "google-maps");
  mapDisplay.attr("src", queryURL);
  mapDisplay.attr("width", "500");
  mapDisplay.attr("height", "400");
  mapDisplay.attr("frameborder", "0");
  mapDisplay.attr("style", "border:0");
  lovePhotoDiv.append(mapDisplay);
}

// MAIN PROCESS
// ==========================================================================================

// add facebook user authentication here:
// -------------------->

// Open the home screen immediately
homeScreen();

// Click event handler for the home-screen-submit button, assigns the user's location and
// desired cuisine type to variables to be used in the yelpSearch function, then executes
// the openScreen function
$(document).on("click", "#home-screen-submit", function(event) {
  event.preventDefault();
  userLocation = $("#user-location").val().trim();
  validation(userLocation);
  $("#user-location").val("");
  console.log(userLocation);
  $("#main-section").empty();
  openScreen();
});

// After the user chooses a cuisine type and clicks the get started button, the yelpSearch
// function is executed without reloading the page
$(document).on("click", "#get-started", function(event) {
  event.preventDefault();
  if($('input[name=optradio]:checked').length === 0) {
    var needCuisineDiv = $("<div>");
    needCuisineDiv.attr("id", "need-cuisine-div");
    needCuisineDiv.html("Please pick a Cuisine Type!");
    $("#get-started").append(needCuisineDiv);
  }
  else {
    $("#need-cuisine-div").hide();
    cuisinePicked = true;
    cuisineChosen = $('input[name=optradio]:checked').val();
    console.log(cuisineChosen);
    yelpSearch();
    $(document).ajaxStop(function() {
      showPhoto();
    });
  }
});

// If the user clicks the like button execute the ??? function
$(document).on("click", "#like-btn", lovePhoto);
  // Execute function for showing yelp restaurant info and google maps directions

// If the user clicks the dislike button, execute the nextPhoto function
$(document).on("click", "#dislike-btn", nextPhoto);


//If user clicks the return to screen option
$(document).on("click", "#return-btn", function(event) {
  event.preventDefault();
  // bug found that you can't return to selection
  returnScreen();
});

// If the user clicks the start over button, execute openScreen function in order to
// choose a differen type of cuisine
$(document).on("click", "#start-over-btn", function() {
 event.preventDefault();
 cuisinePicked = false;

 $("#love-photo").hide();

 openScreen();
});
