const twitter = require('twitter');
const client = new twitter(require('./token.json'));
const fs = require('fs');
const request = require('request');
const scanf = require('scanf');

var id = scanf('%s');   //画像を採取したいアカウントのIDを入力
var array = [];

var MAX_LOOP = 16;
var maxid;
var cnt = 0;

var params = {
    screen_name: id,
    count : 200,
    max_id : maxid,
    include_rts : false
};

getImage(0);

function getImage (loop) {
    if (loop < MAX_LOOP) {
        client.get('statuses/user_timeline', params, (error, tweets, response) => {
            if (!error) {
                for (var i = 0; i < tweets.length; i++) {
                    var tweet = tweets[i];
                    var extended = tweet.extended_entities;
                    if (extended) {
                        for(var j = 0; j < extended.media.length; j++) {
                            console.log(extended.media[j].media_url);
                            array.push(extended.media[j].media_url);
                        }
                    }
                }
                params.max_id = tweet.id - 1; 
                getImage(++loop);
            }
        });
    } else {
        console.log(array.length);

        var interval = setInterval (() => {
            if (cnt < array.length) {
                request
                    .get(array[cnt])
                    .on('error', (err) => {
                        console.log(err);
                    })
                    .on('response', (res) => {
                        console.log('statusCode: ', res.statusCode);
                        console.log('content-length: ', res.headers['content-length']);
                    })
                    .pipe(fs.createWriteStream('./image/data' + [cnt++] + '.jpg')); //保存する場所を指定
            } else {
                clearInterval(interval);
            }
        }, 100);
    }
}
