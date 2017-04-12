   function userLocation() {
           	
           		var label = $("<label>");
           		label.attr("for", "userInput");
           		label.text("Enter Your location:   ");
           		$("#userLocation").append(label);

           		var location = $("<input>");
           		location.attr("id","location");
           		location.attr("type","text");
           		$("#userLocation").append(location)

           		var btn = $("<button>");
                btn.attr("id", "addLocation");
                btn.attr("type", "submit");
                btn.attr("value", "Search");
                btn.text("Search");
                $("#userLocation").append(btn);

              


           }// end of userLocation function

           userLocation();
           $("#addLocation").on("click", function(event) {
         	event.preventDefault();
         	seekerLocation = $("#location").val().trim();
            console.log(seekerLocation);
        });