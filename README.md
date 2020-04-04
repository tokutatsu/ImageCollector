# ImageCollector

Twitterのアカウントを指定して、そのアカウントの過去3200ツイートに含まれる画像を取ってくるアプリ。

アクセストークンは、``token.json``を作成し、そこにトークンを記述する。

``token.json``
```
{
  "consumer_key": "***",
  "consumer_secret": "***",
  "access_token_key" "***",
  "access_token_secret" "***"
}
```
保存先の変更は、``.pipe(fs.createWriteStream('./image/data' + [cnt++] + '.jpg')); ``
の``./image/``部分を変えることで可能。
