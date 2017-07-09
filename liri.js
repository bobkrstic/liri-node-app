
// get the file that holds the twitter keys to the account
// require twitter package
// assign a new variable to hold those keys
var twitterKeys = require("./keys.js");
var Twitter = require('twitter');
var getTweets = new Twitter(twitterKeys.twitterKeys);


// reguire the request package
// and fs package - this is for appending files
var request = require("request");
var fs = require("fs");


// getting spotify keys and importing the spotify package
var spotifyKeys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(spotifyKeys.spotifyKeys);

// getting the input variables from the terminal console
// action will be the one that we will use to call particular functions
// based on what is the input
// value will be name of the song or name of the movie
var action = process.argv[2];
var value = process.argv[3];


// checking what the user input was and using the switch statements to call functions
switch (action) {
	case "my-tweets":
		// at the same time we will append the log.txt file with the command that was
		// provided as the user input
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
		// appending the file with the command before we display data
		fs.appendFile("log.txt", "\r\n" + process.argv[2] + "\r\n", function(err) {
			if (err) {
				console.log("Can't add spotify command: " + err);
			} else {
				console.log("Added spotify command successfully.");
			}
		})

		var nodeArgs = process.argv;
		value = "";

		// we will check if the song has more than one word and if so combine them into 
		// one variable called "value" and then call the function
		for (var i = 3; i < nodeArgs.length; i++) {
			if (i > 3 && i < nodeArgs.length) {
				value = value + "+" + nodeArgs[i];
			} else {
				value += nodeArgs[i];
			}
		}

		
		// if the value is not provided by the user, we will call spotify with The Sign song
		if (value === "" || value === undefined) {
			value = "The Sign";
	    }
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
	// getting the tweets data using the saved keys previously
	getTweets.get('statuses/user_timeline', function(error, tweets, response) {
		for (var i = 0; i < 20; i++) {
			// we will display the tweet and the date was creeated
			console.log(tweets[i].text);
			console.log(tweets[i].created_at);
			console.log("--------------------------------------");


			// then we will append our log.txt file.
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
	
	// calling the spotify api and providing "value" aka name of the song
	spotify.search({ type: 'track', query: value, limit: 1 }, function(err, data) {
		console.log(data.tracks.items);
    		if ( err ) {
        		console.log('Error occurred: ' + err);
      			  return;
    		}

    		// setting the variables and assigning the data values that was retrieved
    		var artist = data.tracks.items[0].artists[0].name;
    		var name = data.tracks.items[0].name;
    		var songLink = data.tracks.items[0].external_urls.spotify;
    		var album = data.tracks.items[0].album.name;
 
    // We will console.log the data
    console.log("The Song's Name: " + name);
    console.log("Artist: " + artist);
    console.log("Song Link: " + songLink);
    console.log("Album: " + album);
    console.log("-------------------------------------------------");

    // then append the same date to the file
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

	// getting the user input again
	var nodeArgs = process.argv;
	var movieName = "";

	// if the user did not provide the name of the movie
	// we will use "Mr. Nobody" movie
	if (nodeArgs[3] === "" || nodeArgs[3] === undefined) {
		movieName = "Mr. Nobody";
	}
	
	// if the movie has more than one word we will combine the input into a variable movieName
	for (var i = 3; i < nodeArgs.length; i++) {
		if (i > 3 && i < nodeArgs.length) {
			movieName = movieName + "+" + nodeArgs[i];
		} else {
			movieName += nodeArgs[i];
		}
	}


	// getting the api data with the movie name
	var queryUrl = 'https://www.omdbapi.com/?apikey=40e9cece&t=' + movieName;

	// Then create a request to the queryUrl
	request(queryUrl, function(error, response, body) {

		// parsing the object received from the api
		var movieObject = JSON.parse(body);
  		// If the request is successful then we will continue
  		if (!error && response.statusCode === 200) {

 	 	// display data into the console
  	 	console.log("Movie Title: " + movieObject.Title);
  	 	console.log("Release year: " + movieObject.Year);
  	 	console.log("IMDB Ratings: " + movieObject.imdbRating);
  	 	console.log("Rotten Tomatoes Rating: " + movieObject.Ratings[1].Value);
  	 	console.log("Country: " + movieObject.Country);
  	 	console.log("Language: " + movieObject.Language);
  	 	console.log("Plot: " + movieObject.Plot);
  	 	console.log("Actors: " + movieObject.Actors);

  	 	// append the file with the same data
  	 	fs.appendFile("log.txt", "\r\n" + process.argv[2] + "\r\n" + "----------------------------------------" + "\r\n" +
  	 					"Movie Title: " + movieObject.Title + "\r\n" +
  	 					"Release Year: " + movieObject.Year + "\r\n" +
  	 					"IMDB Ratings: " + movieObject.imdbRating + "\r\n" +
  	 					"Roten Tomatoes Rating: " + movieObject.Ratings[1].Value + "\r\n" +
  	 					"Country: " + movieObject.Counrty + "\r\n" +
  	 					"Language: " + movieObject.Language + "\r\n" +
  	 					"Plot: " + movieObject.Plot + "\r\n" +
  	 					"Actors: " + movieObject.Actors + "\r\n", 

  	 					// if error then we will display it
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


	// first append the file with the command from the user
	fs.appendFile("log.txt", " " + "\r\n" + process.argv[2] + "\r\n", function(err) {
		if (err) {
			console.log("Error appending file with do-what-it-says sommand: " + err)
		} else {
			console.log("File log.txt appended with do-what-it-says data!");
		}
	})

	// get the data from the random.txt file
	fs.readFile("random.txt", "utf8", function(err, data) {
		if (err) {
			return console.log(err);
		}

	// split the data with the "," sign
	data = data.split(",");

	// chack what is the second element, to see the song name
	console.log("We will spotify-this-song with: " + data[1]);
	

	// value variable that holds the song name is now becoming the data[1] from the file random.txt
	value = data[1];

	// and with that we will call the spotify function
	spotifyThisSong();
	});

}












