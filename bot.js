// Our Twitter library
var Twit = require('twit');

// We need to include our configuration file
var T = new Twit(require('./config.js'));

// This is the URL of a search for the latest tweets on the '#mediaarts' hashtag.
var mentionSearch = {q: "@OwOifierBot", filter: "replies", count: 10, result_type: "recent"}; 

const owoArray = ['1'];

// This function chooses a random number between 0 and 9, and depending on that number, it will choose a different face.
function randomOwO() {
	// Random number is chosen
	let rand = Math.floor(Math.random() * 10);
	// Set into a switch statement to check what it is and which face it corresponds to.
	switch (rand) {
		case 0:
		case 1:
		case 2:
			return "OwO";
		case 3:
		case 4:
		case 5:
			return "UwU";
		case 6:
		case 7:
			return "OWO";
		case 8:
		case 9:
			return "UWU";
	}
}

// This function changes a string to an "OwOified" version of it by replacing r's and l's with w's, n's with ny's, and adds OWO faces after exclamation marks
function stringOwOify(ogText) {
	ogText = ogText.replace(/r/g, 'w');
	ogText = ogText.replace(/R/g, "W");
	ogText = ogText.replace(/l/g, "w");
	ogText = ogText.replace(/L/g, "W");
	ogText = ogText.replace(/na/g, "nya");
	ogText = ogText.replace(/Na/g, "Nya");
	ogText = ogText.replace(/NA/g, "NYA");
	ogText = ogText.replace(/ne/g, "nye");
	ogText = ogText.replace(/Ne/g, "Nye");
	ogText = ogText.replace(/NE/g, "NYE");
	ogText = ogText.replace(/ni/g, "nyi");
	ogText = ogText.replace(/Ni/g, "Nyi");
	ogText = ogText.replace(/NI/g, "NYI");
	ogText = ogText.replace(/no/g, "nyo");
	ogText = ogText.replace(/No/g, "Nyo");
	ogText = ogText.replace(/NO/g, "NYO");
	ogText = ogText.replace(/nu/g, "nyu");
	ogText = ogText.replace(/Nu/g, "Nyu");
	ogText = ogText.replace(/NU/g, "NYU");
	ogText = ogText.replace(/NU/g, "NYU");
	ogText = ogText.replace(/! /g, "! " + randomOwO());
	return ogText;
}


// This function finds the latest reply with the @OwOifierBot mention, likes the reply, gets the tweet from the tweet the reply is to, and replies to the original reply with edited text
function letsOwO() {
	T.get('search/tweets', mentionSearch, function (error, data) {
	  // log out any errors and responses
	  console.log(error, data);
	  // If our search request to the server had no errors...
	  if (!error) {
	  	// Enter a for loop to check if the tweet has already been interacted with. (Work around for favorited being bugged on Twitter's end and more complex code to be written)
		for(let i = 0; i <= data.statuses.length; i++) {
			// If we reach the end of the array without finding a new tweet...
			if (i == data.statuses.length) {
				// Bot logs that no new tweets are available and method ends until next time.
				console.log("No new tweets! Wait until there's a new one!")
				return;
			}
			// Enter a for loop to check through the array of previously interacted with tweet ids going from most recently added id to least recent.
			for(let j = owoArray.length-1; j >= -1; j--) {
				// If loop reaches back of the array without finding a tweet, the tweet has not been interacted with before.
				if (j == -1) {
					//Set id of the reply
					var tweetId = data.statuses[i].id_str;
					//Set id of the tweet above
					var previousTweetId = data.statuses[i].in_reply_to_status_id_str;
					//Set name of who made the reply
					var user = data.statuses[i].user.screen_name;
					//Stops first for loop from running
					i = data.statuses.length + 2;
				}
				// If the id of the reply is equal to the id of a reply already responded to, the loop doesn't check the rest of the array
				else if (data.statuses[i].id_str == owoArray[j]) {
					break;
				}
			}
		}

		// Let bot know the reply is being interacted with this interation, and does not need to be interacted with again by adding it to the array
		owoArray.push(tweetId);

		// Bot likes the reply
		T.post('favorites/create', { id: tweetId }, function (error, response) {
			// Prints out response and if there are any errors.
			console.log(response, error);
			// If there is an error, most likely it will be that the reply has already been liked, so there is no need to reply as it has already been interacted with and replied to.
			if (error) {
				// Method stops
				return;
			}
			// If there is a positive response, then the reply has been liked, and the bot prints it to the console.
			if (response) {
				console.log("Tweet has been liked!");
			}
		})

		// This function gets the tweet that the reply with the @OwOifierBot is asking to be "OwOified", so the bot can find the text of the tweet.
		T.get('statuses/show/' + previousTweetId, {}, function (error, data) {
			// Prints out if there are any errors and the data associated with the tweet
			console.log(error, data);
			// If there are no errors...
			if (!error) {
				// Set ogText the original text of the tweet
				var ogText = data.text;
				// Call stringOwOify function to change original text and set it to a new variable.
				var oWoText = stringOwOify(ogText);
				// Add a mention of the user to the text to fulfill a rule on Twitter that you can only reply to a tweet if the bot mentions them somewhere in the tweet.
				oWoText = oWoText + " @" + user;

				// If the length of the tweet text is within Twitter's posting limit...
				if (oWoText.length <= 280) {
					// The Bot replies to the reply mentioning the bot with the "owoified" text.
					T.post('statuses/update', {status: oWoText, in_reply_to_status_id: tweetId}, function (error, data, response) {
						// If everything goes correctly, the bot will print that it has successfully tweeted.
						if (response) {
							console.log('Success! Check your bot, it should have tweeted something.')
						}
						// If there was an error with our Twitter call, we print it out here.
						if (error) {
							console.log('There was an error with Twitter:', error);
						}
					})
				// If the length of the tweet text is too long for Twitter's posting limit...
				} else {
					// The Bot replies to the reply mentioning the bot letting them know the changed text would be too long to post unfortunately.
					T.post('statuses/update', {status: "Sowwy, buw the OwOified text wouwd be too wong! BwB @" + user , in_reply_to_status_id: tweetId}, function (error, data, response) {
						// If everything goes correctly, the bot will print that it has successfully tweeted.
						if (response) {
							console.log('Success! Check your bot, it should have tweeted something.')
						}
						// If there was an error with our Twitter call, we print it out here.
						if (error) {
							console.log('There was an error with Twitter:', error);
						}
					})
				}
			}
		})
		
	  }
	  // However, if our original search request had an error, we want to print it out here.
	  else {
	  	console.log('There was an error with your hashtag search:', error);
	  }
	});
}

// Try to look for a mention as soon as the program runs
letsOwO();
// ...and then every 30 seconds after that
setInterval(letsOwO, 1000 * 30);
