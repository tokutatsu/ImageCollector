const twitter = require('twitter');
const client = new twitter(require('./token.json'));
const fs = require('fs');
const request = require('request');
const id = require('./id.json');

var array = [];
var params = {
    screen_name: id.sample,
    count : 200,
    include_rts : false
};

client.get('statuses/user_timeline', params, function(error, tweets, response){
    if (!error) {
        for (var i = 0; i < tweets.length; i++) {
            var tweet = tweets[i];
            if (tweet.extended_entities) {
                for(var j = 0; j < tweet.extended_entities.media.length; j++) {
                    console.log(tweet.extended_entities.media[j].media_url);
                    array.push(tweet.extended_entities.media[j].media_url);
                }
            } else {
                console.log("no image");
            }
        }
        console.log(array);
        for(var i = 0; i < array.length; i++){
            request
                .get(array[i])
                .on('response', function (res) {
                    console.log('statusCode: ', res.statusCode);
                    console.log('content-length: ', res.headers['content-length']);
                })
                .pipe(fs.createWriteStream('./image/data' + [i] + '.jpg')); //保存する場所を指定
        }
    }
});
