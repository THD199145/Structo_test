const webSocket = require('ws');
const request = require('request');

async function clientWork() {
    // login and get token
    const res = await login();
    if (res.code == 200 && res.token) {
        // send msg to socket server
        const ws_client = new webSocket(process.env.socket_server_url);
        ws_client.on('open', () => {
            ws_client.send(res.token);
        });

        ws_client.on('close', () => {
            console.log('connection close');
        });

        ws_client.on('message', (data) => {
            data = JSON.parse(data);
            if (data.code == 200) {
                console.log(data.msg);
            } else {
                console.log(data);
                ws_client.close();
            }
        });
    } else {
        console.log(res);
    }
};

async function login() {
    return new Promise((res, rej) => {
        request.post(process.env.api_server_url + '/login', {
            json: true,
            body: {
                "username":"test@gmail.com",
	            "password": "111111"
            }
        }, (err, response, body) => {
            if (!err && response.statusCode == 200) {
                res(body);
            } else {
                rej(err);
            }
        })
    });
};

clientWork();