const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bodyParser  = require('body-parser');
const webSocket = require('ws');
const fs = require('fs');

const errMsg = require('./errorMessage');

const app = express();
app.use(bodyParser.json());

app.post('/login', (req, res) => {
    const username = req.body.username;
    const pwd = req.body.password;
    
    if (!username || !pwd) {
        res.send(errMsg.username_pwd_empty);
        return;
    }

    let md5 = crypto.createHash('md5');
    const pwd_md5 = md5.update(pwd).digest("hex");

    if (username != process.env.default_username || pwd_md5 != process.env.default_pwd) {
        res.send(errMsg.username_pwd_error);
        return;
    }

    // create token
    const token = jwt.sign({user: username}, process.env.secret, {expiresIn: process.env.token_expires});
    // save token
    fs.writeFileSync('./data/token.txt', token);

    res.send({code: 200, token: token});
});


let tempToken = '';
let timer = null;
const ws_server = new webSocket.Server({port: process.env.socket_port});
ws_server.on('connection', (ws) => {
    ws.on('message', (message) => {
        console.log('receive client message.....');
        const tokenMsg = verifytoken(message);
        if (tokenMsg.success) {
            tempToken = message;
            ws.send(JSON.stringify({code: 200, msg: new Date().toUTCString()}));
            clearInterval(timer);

            timer = setInterval(() => {
                const tempTokenMsg = verifytoken(tempToken);
                if (tempTokenMsg.success) {
                    ws.send(JSON.stringify({code: 200, msg: new Date().toUTCString()}));
                } else {
                    clearInterval(timer);
                    ws.send(JSON.stringify(tempTokenMsg.msg));
                }
            }, 5000);
        } else {
            ws.send(JSON.stringify(tokenMsg.msg));
        }
    });

    ws.on('close', () => {
        clearInterval(timer);
        console.log('connection close');
    });
});

function verifytoken(data) {
    const token = fs.readFileSync('./data/token.txt', 'utf-8');

    if (token != data) {
        return {success: false, msg: errMsg.token_error};
    }

    try {
        const decoded = jwt.verify(data, process.env.secret);
    } catch(err) {
        return {success: false, msg: errMsg.token_expired};
    }
    
    return {success: true, msg: ''};
}

app.listen(process.env.api_port, () => {console.log(`api listening ${process.env.api_port}`)});
console.log(`socket listening ${process.env.socket_port}`);