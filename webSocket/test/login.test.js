const assert = require('assert');
const request = require('request');
const fs = require('fs');

require('dotenv').config();

describe('unit test of login', () => {
    it('username or password is empty', (done) => {
        request.post(process.env.api_server_url + '/login', {
            json: true,
            body: {
                "username":"test@gmail.com",
	            "password": ""
            }
        }, (err, response, body) => {
            assert.equal(body.code, 1001);
            done();
        });
    });

    it('username or password error', (done) => {
        request.post(process.env.api_server_url + '/login', {
            json: true,
            body: {
                "username":"test@gmail.com",
	            "password": "11111111"
            }
        }, (err, response, body) => {
            assert.equal(body.code, 1002);
            done();
        });
    });

    it('normal', (done) => {
        request.post(process.env.api_server_url + '/login', {
            json: true,
            body: {
                "username":"test@gmail.com",
	            "password": "111111"
            }
        }, (err, response, body) => {
            const token = fs.readFileSync('./data/token.txt', 'utf-8');
            assert.equal(body.code, 200);
            assert.equal(body.token, token);
            done();
        });
    });
});