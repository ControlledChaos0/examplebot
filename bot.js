// Our Twitter library
var Twit = require('twit');

// We need to include our configuration file
var T = new Twit(require('./config.js'));

// This is the URL of a search for the latest tweets on the '#mediaarts' hashtag.
var mentionSearch = {q: "@OwOifierBot", filter: "replies", count: 10, result_type: "recent"}; 


/*function replyOwO() {
	T.get('search/tweets', mentionSearch, )
}*/






// This function finds the latest tweet with the #mediaarts hashtag, and retweets it.
function retweetLatest() {
	T.get('search/tweets', mentionSearch, function (error, data) {
	  // log out any errors and responses
	  console.log(error, data);
	  // If our search request to the server had no errors...
	  if (!error) {
	  	// ...then we grab the ID of the tweet we want to retweet...
		var retweetId = data.statuses[0].in_reply_to_status_id_str;
		var replyUserId = data.statuses[0].in_reply_to_screen_name;
		T.post('users/likes/' + data.statuses[0].id_str, { }, function (error, response) {
			console.log(response, error);
			if (response) {
				console.log("Tweet has been liked!");
			}
			if (error) {
				console.log("God fuck goddammit fuck shit fuck");
			}
		})
		
		var originalTweet =  replyUserId + '/status/' + retweetId;


		T.get('tweets/' + retweetId, {}, function (error, data) {
			//console.log(error, data);
			if (!error) {
				/*T.post('statuses/retweet/' + retweetId, { }, function (error, response) {
					if (response) {
						console.log('Success! Check your bot, it should have retweeted something.')
					}
					// If there was an error with our Twitter call, we print it out here.
					if (error) {
						console.log('There was an error with Twitter:', error);
					}
				})*/
			}
		})
		
		console.log(retweetId);
	  }
	  // However, if our original search request had an error, we want to print it out here.
	  else {
	  	console.log('There was an error with your hashtag search:', error);
	  }
	});
}

// Try to retweet something as soon as we run the program...
retweetLatest();
// ...and then every hour after that. Time here is in milliseconds, so
// 1000 ms = 1 second, 1 sec * 60 = 1 min, 1 min * 60 = 1 hour --> 1000 * 60 * 60
setInterval(retweetLatest, 1000 * 60 * 60);
