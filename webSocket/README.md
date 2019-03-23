## socket server and client
 <p> POST /login, can login through rest server
 
 ```javascript
 // request body
 {
    "username":"test@gmail.com",
    "password": "111111"
 }

 // response
 {
    "code": 200,
    "token": "xxxx"
}
```

code | Description
------|------------
200  | success.
1001 | username or password is empty.
1002 | username or password is invalid.
1003 | token invalid.
1004 | token expired.

## Run the server:
<p>1 npm install
<p>2 npm start(product environment) or npm run dev(convenient debugging for development environment) 
<p>Rest api and socket server will run after npm start or npm run dev.
<p>3 npm run client(start socket client and login to rest server and send message to socket server)

# Run test
<p> 1 npm install -gobal mocha
<p> 2 npm test
