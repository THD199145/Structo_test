var assert = require('assert');
const request = require('request');


describe('unit test of searchnews', () => {
    it('parameter lost1', (done) => {
        request('http://127.0.0.1:3000/searchnews', (err, response, body) => {
            assert.equal(response.statusCode, 200);
            done();
        });
    });
    it('parameter lost2', (done) => {
        request('http://127.0.0.1:3000/searchnews?query=', (err, response, body) => {
            assert.equal(response.statusCode, 200);
            done();
        });
    });
    it('normal', (done) => {
        request('http://127.0.0.1:3000/searchnews?query=print', (err, response, body) => {
            let keyNums = 0;

            const data = JSON.parse(body);
            assert.notEqual(data.length, 0);

            if (data[0].title && data[0].time && data[0].type && data[0].score && data[0].url) keyNums = 5;
            assert.equal(keyNums, 5);

            assert.equal(response.statusCode, 200);
            done();
        });
    });
});