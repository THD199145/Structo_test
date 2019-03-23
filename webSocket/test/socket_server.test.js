const assert = require('assert');
const request = require('request');
const webSocket = require('ws');
const fs = require('fs');

require('dotenv').config();

const ws_client = new webSocket(process.env.socket_server_url);
describe('unit test of socket connection', () => {
    it('login normal', (done) => {
        request.post(process.env.api_server_url + '/login', {
            json: true,
            body: {
                "username":"test@gmail.com",
	            "password": "111111"
            }
        }, (err, response, body) => {
            ws_client.send('111111111');
            ws_client.send(body.token);

            ws_client.on('close', () => {
                console.log('connection close');
            });

            ws_client.on('message', (data) => {
                data = JSON.parse(data);
                if (data.code == 1003) {
                    console.log(data);
                    assert.equal(data.code, 1003);
                }
                if (data.code == 1004) {
                    console.log(data);
                    assert.equal(data.code, 1004);
                    ws_client.close();
                }
                if (data.code == 200) {
                    console.log(data);
                    assert.equal(data.code, 200);
                }
            });

            done();
        });
    });
});