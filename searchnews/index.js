const express = require('express');
const request = require('request');

const app = express();
const port = 3000;

app.get('/searchnews', async (req, res) => {
    const query = req.query.query;

    const storyUrl = query ? 'https://hacker-news.firebaseio.com/v0/topstories.json?' + `print=${query}` : 'https://hacker-news.firebaseio.com/v0/topstories.json?';
    const storiesId = await getUrl(storyUrl);

    if (storiesId.length == 0) return [];

    let storys = [];
    for (let id of JSON.parse(storiesId)) {
        const url = `https://hacker-news.firebaseio.com/v0/item/${id}.json` + (query ? `?print=${query}` : '');
        storys.push(getUrl(url));
    }

    const result = await Promise.all(storys).then(data => {
        let temp = [];
        for (let val of data) {
            temp.push(formatData(val));
        }
        return temp;
    }).catch(err => {
        return err;
    })

    res.send(result);
});


function formatData(data) {
    if (!data) return null;
    data = JSON.parse(data);
    return {
        title: data.title ? data.title : '',
        time: data.time ? data.time : null,
        type: data.type ? data.type : '',
        score: data.score ? data.score : null,
        url: data.url ? data.url : ''
    };
}

async function getUrl(url) {
    return new Promise((res, rej) => {
        request(url, (err, response, body) => {
            if (!err && response.statusCode == 200) {
                res(body);
            } else {
                rej(err);
            }
        })
    });
}


app.listen(port, () => {console.log('listening 3000')});