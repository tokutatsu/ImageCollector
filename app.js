const twitter = require('twitter');
const client = new twitter(require('./token.json'));
const fs = require('fs');
const request = require('request');
const scanf = require('scanf');

console.log("アカウントのIDを入力してください:");
var AccountId = scanf('%s');   //画像を採取したいアカウントのIDを入力
var array = [];
var MAX_LOOP = 16;
var maxid;
var params = {
    screen_name: AccountId,
    count : 200,
    max_id : maxid,
    include_rts : false
};

getImage(0);

function getImage(loop) {
    if (loop < MAX_LOOP) {
        client.get('statuses/user_timeline', params, (error, tweets, response) => {
            if (!error) {
                params.max_id = ArrayPush(tweets) - 1; 
                getImage(++loop);
            }
        });
    } else {
        var cnt = 0;
        console.log(array.length);

        var interval = setInterval (() => {
            if (cnt < array.length) {
                cnt = Preserve(cnt);
            } else {
                clearInterval(interval);
            }
        }, 80);
    }
}

function ArrayPush(tweets) {
    tweets.forEach((tweet) => {
        if (tweet.extended_entities) {
            tweet.extended_entities.media.forEach((media) => {
                array.push(media.media_url);
            });
        }
    });
    return tweets[tweets.length - 1].id;
}

function Preserve(cnt) {
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
    return cnt;
}
