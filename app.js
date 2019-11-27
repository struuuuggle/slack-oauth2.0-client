//@ts-check

const request = require('request')
const express = require('express');
const app = express();

// Slack App の Client ID
const slack_client_id = '';
// Slack App の Client Secret
const slack_client_secret = '';

app.get('/', (req, res) => {
    // 認可コードの取得
    const code = req.query["code"];

    // 認可コードを使って、アクセストークンをリクエスト
    request({
        url: "https://slack.com/api/oauth.access",
        method: "POST",
        form: {
            client_id: slack_client_id,
            client_secret: slack_client_secret,
            code: code
        }
    }, (error, response, body) => {
        // レスポンスからアクセストークンを取得する
        const param = JSON.parse(body);
        const access_token = param['access_token'];

        // ユーザIDを取得するためのリクエスト
        request({
            url: "https://slack.com/api/users.identity",
            method: "POST",
            form: {
                token: access_token
            }
        }, (error, response, body) => {
            const user = JSON.parse(body);
            // TODO: name, id, email, image_*をparse
            res.json(user);
        })
    })
})

app.listen(3000, () =>{
        console.log('HTTP Server(3000) is running.');
});
