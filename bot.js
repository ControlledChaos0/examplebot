// Our Twitter library
var Twit = require('twit');

// We need to include our configuration file
var T = new Twit(require('./config.js'));

// This is the URL of a search for the latest tweets on the '#mediaarts' hashtag.
var mentionSearch = {q: "@OwOifierBot", filter: "replies", count: 10, result_type: "recent"}; 

const owoArray = ['1'];

function randomOwO() {
	let rand = Math.floor(Math.random() * 10);
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
	ogText = ogText.replace(/! /g, randomOwO());
	return ogText;
}


// This function finds the latest tweet with the #mediaarts hashtag, and retweets it.
function letsOwO() {
	T.get('search/tweets', mentionSearch, function (error, data) {
	  // log out any errors and responses
	  console.log(error, data);
	  // If our search request to the server had no errors...
	  if (!error) {
	  	// ...then we grab the ID of the tweet we want to retweet...
		for(var i = 0; i <= data.statuses.length; i++) {
			if (i == data.statuses.length) {
				console.log("No new tweets! Wait until there's a new one!")
				return;
			}
			for(var j = owoArray.length-1; j >= -1; j--) {
				if (j == -1) {
					var tweetId = data.statuses[i].id_str;
					var previousTweetId = data.statuses[i].in_reply_to_status_id_str;
					var user = data.statuses[i].user.screen_name;
					i = data.statuses.length + 2;
				}
				else if (data.statuses[i].id_str == owoArray[j]) {
					break;
				}
			}
		}

		owoArray.push(tweetId);

		T.post('favorites/create', { id: tweetId }, function (error, response) {
			console.log(response, error);
			if (response) {
				console.log("Tweet has been liked!");
			}
			if (error) {
				console.log("aaaaaaaaaa");
			}
		})

		T.get('statuses/show/' + previousTweetId, {}, function (error, data) {
			console.log(error, data);
			if (!error) {
				var ogText = data.text;
				var oWoText = stringOwOify(ogText);
				oWoText = oWoText + " @" + user;

				if (oWoText.length <= 280) {
					T.post('statuses/update', {status: oWoText, in_reply_to_status_id: tweetId}, function (error, data, response) {
						if (response) {
							console.log('Success! Check your bot, it should have tweeted something.')
						}
						// If there was an error with our Twitter call, we print it out here.
						if (error) {
							console.log('There was an error with Twitter:', error);
						}
					})
				} else {
					T.post('statuses/update', {status: "Sowwy, buw the OwOified text wouwd be too wong! BwB @" + user , in_reply_to_status_id: tweetId}, function (error, data, response) {
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

// Try to retweet something as soon as we run the program...
letsOwO();
// ...and then every hour after that. Time here is in milliseconds, so
// 1000 ms = 1 second, 1 sec * 60 = 1 min, 1 min * 60 = 1 hour --> 1000 * 60 * 60
setInterval(letsOwO, 1000 * 30);
