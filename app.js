const twitter = require('twitter');
const client = new twitter(require('./token.json'));
const fs = require('fs');
const request = require('request');
const scanf = require('scanf');

var id = scanf('%s');   //画像を採取したいアカウントのIDを入力
var array = [];

var MAX_LOOP = 16;
var maxid;
cnt = 0;

var params = {
    screen_name: id,
    count : 200,
    max_id : maxid,
    include_rts : false
};

getImage(0);

function getImage (loop) {
    if (loop >= MAX_LOOP) {
        console.log(array.length);

        var interval = setInterval (function () {
            if (cnt < array.length) {
                request
                    .get(array[cnt])
                    .on('error', function(err){
                        console.log(err);
                    })
                    .on('response', function (res) {
                        console.log('statusCode: ', res.statusCode);
                        console.log('content-length: ', res.headers['content-length']);
                    })
                    .pipe(fs.createWriteStream('./image/data' + [cnt] + '.jpg')); //保存する場所を指定
                cnt++;
            } else {
                clearInterval(interval);
            }
        }, 100);
    } else {
        client.get('statuses/user_timeline', params, function(error, tweets, response){
            if (!error) {
                for (var i = 0; i < tweets.length; i++) {
                    var tweet = tweets[i];
                    if (tweet.extended_entities) {
                        for(var j = 0; j < tweet.extended_entities.media.length; j++) {
                            console.log(tweet.extended_entities.media[j].media_url);
                            array.push(tweet.extended_entities.media[j].media_url);
                        }
                    }
                }
                params.max_id = tweet.id - 1; 
                getImage(++loop);
            }
        });
    }
}
