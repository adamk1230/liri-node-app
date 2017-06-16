var fs = require("fs");
var keys = require("./keys.js");

// console.log(keys.twitterKeys);
var Twitter = require('twitter');
 
var client = new Twitter(keys.twitterKeys);
 
var params = {screen_name: 'AceKingRCB'};

var command = process.argv[2];

var movieName = "";
var nodeArgs = process.argv;
var request = require("request");

var randomArray = []; 

// client.get('search/tweets', {q: 'node.js'}, function(error, tweets, response) {
//    console.log(tweets);
// });

switch (command) {
	case "my-tweets":
		twitter();
		break;

	case "spotify-this-song":
		spottify();
		break;

	case "movie-this":
		movie();
		break;

	case "do-what-it-says":
		doWhat();
		break;

}





function twitter() {

client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
    // console.log(tweets[1].text);
    // console.log(tweets.length)
  };
  // console.log(tweets);
  // console.log(response);
  	for (var i = 0; i < tweets.length; i++) {
		    console.log(tweets[i].text);
		    console.log(tweets[i].created_at);
	}
});

}// end twitter

function spotify(){
	console.log("spotify stuff");
}

function movie(){
	for (var i = 3; i < nodeArgs.length; i++) {

  if (i > 3 && i < nodeArgs.length) {

    movieName = movieName + "+" + nodeArgs[i];

  }

  else {

    movieName += nodeArgs[i];

  }
}

// Then run a request to the OMDB API with the movie specified
var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";

// This line is just to help us debug against the actual URL.
// console.log(queryUrl);

request(queryUrl, function(error, response, body) {

  // If the request is successful
  if (!error && response.statusCode === 200) {

    // Parse the body of the site and recover just the imdbRating
    // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
    console.log("The Movie Title Is: " + JSON.parse(body).Title);
    console.log("Release Year: " + JSON.parse(body).Year);
    console.log("The IMDB Rating Is: " + JSON.parse(body).imdbRating);
    console.log("The Movie was Produced In: " + JSON.parse(body).Country);
    console.log("The Movie Is In: " + JSON.parse(body).Language);
    console.log("The Plot of the Movie Is: " + JSON.parse(body).Plot);
    console.log("Some Actors In The Movie Include: " + JSON.parse(body).Actors);
    console.log("The Rotten Tomatoes Link Is: " + "https://www.rottentomatoes.com/m/" + movieName);

  }
});

}// End of Movie



function doWhat(){

	fs.readFile("random.txt", "utf8", function(err, data) {
		if (err){
			console.log(err);
		}

		randomArray = data.split(",")
		console.log(randomArray);

	}); // end of fs read

}



