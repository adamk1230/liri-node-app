var fs = require("fs");
var keys = require("./keys.js");


// Twitter
var Twitter = require('twitter');
var client = new Twitter(keys.twitterKeys);
var params = {screen_name: 'AceKingRCB'};


//Spotify
var Spotify = require('node-spotify-api');
var spotify = new Spotify({
  id: "bb8cd24f0e1f4383b4c3fb05ef42785a",
  secret: "9c34c4836d9f43479f659fa48dd554de"
});
var songTitle = "";


//OMDB
var request = require("request");
var movieName = "";


//doWhat
var randomArray = []; 


//node
var command = process.argv[2];
var nodeArgs = process.argv;


//function to hold switch/case
function runSwitch(){

  switch (command) {
  	case "my-tweets":
  		twitter();
  		break;

  	case "spotify-this-song":
  		spot();
  		break;

  	case "movie-this":
  		movie();
  		break;

  	case "do-what-it-says":
  		doWhat();
  		break;

    default:
      console.log("Plese use one of the following commands: my-tweets, spotify-this-song, movie-this, do-what-it-says.") 
      break;

  }

}//end runSwitch

//initial run
runSwitch();


//function to handle the twitter request
function twitter() {

client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
    // console.log(tweets[1].text);
    // console.log(tweets.length)
  };
  // console.log(tweets);
  // console.log(response);
  	for (var i = 0; i < tweets.length; i++) {
        console.log("----------------------------------");
		    console.log("Tweet: " + tweets[i].text);
		    console.log("Created: " + tweets[i].created_at);
        console.log("----------------------------------");

        // append to log.txt
        fs.appendFile("log.txt", 
          "\n" +   
          "----------------------------------\n" + 
          "Tweet: " + tweets[i].text + "\n" +
          "Created: " + tweets[i].created_at + "\n" +
          "----------------------------------\n",
        function(err) {
          if (err) {
            console.log(err);
          }

        });//end fs append



	}
});

}// end twitter


//spotify function that gets called in the switch case
function spot(){

  if (!nodeArgs[3]) {

    songTitle = "the sign ace of base";
    spotifySearch();

  }

  else {

    var sep = "";
    for (var i = 3; i < nodeArgs.length; i++) {
      
      songTitle += sep + nodeArgs[i];
      sep = " ";

    }
    spotifySearch();

  }
	

} //end spot


// movie function that gets called in the switch case
function movie(){

  if (!nodeArgs[3]) {

    movieName = "Mr.Nobody";
    movieSearch();

  }

  else{

  	for (var i = 3; i < nodeArgs.length; i++) {

      if (i > 3 && i < nodeArgs.length) {

      movieName = movieName + "+" + nodeArgs[i];

      }

      else {

      movieName += nodeArgs[i];

      }
    }

    movieSearch();

  }


}// End of Movie


// function that handles the fs.read of random.txt
function doWhat(){

	fs.readFile("random.txt", "utf8", function(err, data) {
		if (err){
			console.log(err);
		}

		randomArray = data.split(",")
		// console.log(randomArray);
    command = randomArray[0];
    process.argv[3] = randomArray[1];

  // console.log(command);
  // console.log(process.argv[3]);
  runSwitch();


	}); // end of fs read

  // console.log(randomArray);  //maybe  fs.readFile is asynchronous


}// end of dowhat


// function handles the spotify query
function spotifySearch(){

  spotify.search({ type: 'track', query: songTitle }, function(err, data) {
  if (err) {
    return console.log('Error occurred: ' + err);
  }
  console.log("----------------------------------");
  console.log("Artist Name: " + data.tracks.items[0].album.artists[0].name);  // artist name
  console.log("Track Name: " + data.tracks.items[0].name); // name of track
  if(data.tracks.items[0].preview_url){
    console.log("Preview URL: " + data.tracks.items[0].preview_url); // preview url
  } 
  else {
    console.log("Preview URL: Not Available"); //if preview url is null, displays Not Available
  }   
  console.log("Album Name: " + data.tracks.items[0].album.name); // album name
  console.log("----------------------------------");

  // append to log.txt
  fs.appendFile("log.txt", 
  "\n" +   
  "----------------------------------\n" + 
  "Artist Name: " + data.tracks.items[0].album.artists[0].name + "\n" +
  "Track Name: " + data.tracks.items[0].name + "\n" +
  "Preview URL: " + data.tracks.items[0].preview_url + "\n" +
  "Album Name: " + data.tracks.items[0].album.name + "\n" +
  "----------------------------------\n",

  function(err) {

  if (err) {
    console.log(err);
  }

  });//end fs append


  }); //end spotify.search
  

}//end spotifySearch


// function handles the omdb query
function movieSearch(){

  // Then run a request to the OMDB API with the movie specified
  var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";

// This line is just to help us debug against the actual URL.
// console.log(queryUrl);
  
  request(queryUrl, function(error, response, body) {

    // If the request is successful
    if (!error && response.statusCode === 200) {

      // Parse the body of the site and recover just the imdbRating
      // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
      console.log("----------------------------------");
      console.log("Movie Title: " + JSON.parse(body).Title);
      console.log("Release Year: " + JSON.parse(body).Year);
      console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
      console.log("Produced In: " + JSON.parse(body).Country);
      console.log("Language: " + JSON.parse(body).Language);
      console.log("Plot: " + JSON.parse(body).Plot);
      console.log("Actors: " + JSON.parse(body).Actors);
      console.log("Movie Website: " + JSON.parse(body).Website);
      console.log("----------------------------------");

      // append to log.txt
      fs.appendFile("log.txt", 
      "\n" +   
      "----------------------------------\n" + 
      "Movie Title: " + JSON.parse(body).Title + "\n" +
      "Release Year: " + JSON.parse(body).Year + "\n" +
      "IMDB Rating: " + JSON.parse(body).imdbRating + "\n" +
      "Produced In: " + JSON.parse(body).Country + "\n" +
      "Language: " + JSON.parse(body).Language + "\n" +
      "Plot: " + JSON.parse(body).Plot + "\n" +
      "Actors: " + JSON.parse(body).Actors + "\n" +
      "Movie Website: " + JSON.parse(body).Website + "\n" +
      "----------------------------------\n",

      function(err) {

        if (err) {
          console.log(err);
        }
      });//end fs append

    } //end if

  });  //end request

}// end movieSearch



