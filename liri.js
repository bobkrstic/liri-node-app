var twitterKeys = require("./keys.js");
var Twitter = require('twitter');
var getTweets = new Twitter(twitterKeys.twitterKeys);



var request = require("request");
var fs = require("fs");

var spotifyKeys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(spotifyKeys.spotifyKeys);


// var spotify = new Spotify({
//   id: "0dd86410cb5948c1bf210c8551237b60",
//   secret: "99f39161d3514c9b991adc46e3753787"
// });


var action = process.argv[2];
var value = process.argv[3];

switch (action) {
	case "my-tweets":
		fs.appendFile("log.txt", "\r\n" + process.argv[2] + "\r\n", function(err) {
			if (err) {
				console.log("my-tweets command unsuccessful: " + err);
			} else {
				console.log("Command my-tweets added to the log.txt file too.");
			}
		})
		myTweets();
		break;

	case "spotify-this-song":
		fs.appendFile("log.txt", "\r\n" + process.argv[2] + "\r\n", function(err) {
			if (err) {
				console.log("Can't add spotify command: " + err);
			} else {
				console.log("Added spotify command successfully.");
			}
		})
		spotifyThisSong();
		break;

	case "movie-this":
		movieThis();
		break;

	case "do-what-it-says":
		doWhatItSays();
		break;
}



function myTweets() {
	getTweets.get('statuses/user_timeline', function(error, tweets, response) {
		for (var i = 0; i < 20; i++) {
			console.log(tweets[i].text);
			console.log(tweets[i].created_at);
			console.log("--------------------------------------");

			fs.appendFile("log.txt", "\r\n" + 
				           tweets[i].text + "\r\n" + 
				           tweets[i].created_at + "\r\n" + "-------------------------------------", 

							function(err) {
								if (err) {
									console.log("Can't add tweets to the file log.txt: " + err);
									return;
								}
			})

			console.log("Tweet added to the log.txt file.");
			console.log("-------------------------------------");
		}
	});
}

// 78901234 slkrsticspot
function spotifyThisSong() {
	
	spotify.search({ type: 'track', query: value, limit: 1 }, function(err, data) {
    		if ( err ) {
        		console.log('Error occurred: ' + err);
      			  return;
    		}

    		var artist = data.tracks.items[0].artists[0].name;
    		var name = data.tracks.items[0].name;
    		var songLink = data.tracks.items[0].external_urls.spotify;
    		var album = data.tracks.items[0].album.name;
 
    // Do something with 'data' 
    console.log("The Song's Name: " + name);
    console.log("Artist: " + artist);
    console.log("Song Link: " + songLink);
    console.log("Album: " + album);
    console.log("-------------------------------------------------");

    fs.appendFile("log.txt", "The Song's Name: " + name + "\r\n" +
    	                     "Artist: " + artist + "\r\n" + 
    	                     "Song Link: " + songLink + "\r\n" + 
    	                     "Album: " + album + "\r\n", 

    	                     function(err) {
    	                     	if (err) {
    	                     		console.log("Cant add from spotify file: " + err);
    	                     	} else {
    	                     		console.log("Spotify data added to the log.txt file successfully.");
    	                     	}
    	                     })
	});
}


function movieThis() {

	var nodeArgs = process.argv;
	var movieName = "";

	if (nodeArgs[3] === "" || nodeArgs[3] === undefined) {
		movieName = "Mr. Nobody";
	}
	//console.log("nodeArgs: " + nodeArgs)

	for (var i = 3; i < nodeArgs.length; i++) {
		if (i > 3 && i < nodeArgs.length) {
			movieName = movieName + "+" + nodeArgs[i];
		} else {
			movieName += nodeArgs[i];
		}
	}


	//console.log("Value: " + movieName);
	var queryUrl = 'https://www.omdbapi.com/?apikey=40e9cece&t=' + movieName;
	// Then create a request to the queryUrl
	request(queryUrl, function(error, response, body) {
		//console.log(queryUrl);

		var movieObject = JSON.parse(body);
  		// If the request is successful
  		if (!error && response.statusCode === 200) {

 	 	// Then log the Release Year for the movie
  	 	// Parse the body of the site and recover just the year
  	 	//console.log("This is json parse body: " + JSON.parse(body));
  	 	console.log("Movie Title: " + movieObject.Title);
  	 	console.log("Release year: " + movieObject.Year);
  	 	console.log("IMDB Ratings: " + movieObject.imdbRating);
  	 	console.log("Rotten Tomatoes Rating: " + movieObject.Ratings[1].Value);
  	 	console.log("Country: " + movieObject.Country);
  	 	console.log("Language: " + movieObject.Language);
  	 	console.log("Plot: " + movieObject.Plot);
  	 	console.log("Actors: " + movieObject.Actors);


  	 	fs.appendFile("log.txt", "\r\n" + process.argv[2] + "\r\n" + "----------------------------------------" + "\r\n" +
  	 					"Movie Title: " + movieObject.Title + "\r\n" +
  	 					"Release Year: " + movieObject.Year + "\r\n" +
  	 					"IMDB Ratings: " + movieObject.imdbRating + "\r\n" +
  	 					"Roten Tomatoes Rating: " + movieObject.Ratings[1].Value + "\r\n" +
  	 					"Country: " + movieObject.Counrty + "\r\n" +
  	 					"Language: " + movieObject.Language + "\r\n" +
  	 					"Plot: " + movieObject.Plot + "\r\n" +
  	 					"Actors: " + movieObject.Actors + "\r\n", 

  	 					function(err) {
  	 						if (err) {
  	 							console.log("Error writing movie in the log.txt file: " + err);
  	 						} else {
  	 							console.log("Movie added to the log.txt file.");
  	 						}
  	 					})
	    }
	});
}


function doWhatItSays() {

	fs.appendFile("log.txt", " " + "\r\n" + process.argv[2] + "\r\n", function(err) {
		if (err) {
			console.log("Error appending file with do-what-it-says sommand: " + err)
		} else {
			console.log("File log.txt appended with do-what-it-says data!");
		}
	})

	fs.readFile("random.txt", "utf8", function(err, data) {
		if (err) {
			return console.log(err);
		}
	data = data.split(",");
	console.log("We will spotify-this-song with: " + data[1]);
	

	value = data[1];
	spotifyThisSong();
	});

}












