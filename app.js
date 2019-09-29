const fs = require('fs');
const https = require('https');
const http = require('http');
const crypto = require('crypto');

// Get express framework
const express = require('express');
const Session = require('express-session');

// Create an express application
const app = express();

// TLS Setup
var tlsOptions = {
  key: fs.readFileSync('./tls/key.pem'),
  cert: fs.readFileSync('./tls/cert.pem'),
  secureProtocol: 'TLSv1_2_method',
  ciphers:"ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256",
};

// Express Session middleware setup
const secret = crypto.randomBytes(64).toString('hex');
app.use(Session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
    cookie:{path: '/', httpOnly: true, secure: true, maxAge: 600000, sameSite: 'strict'}
}));

// Create a default endpoint
app.get('/', (req, res) => {
        
  if (typeof req.session.name!= 'undefined'){
      // Session already exist
      res.send("Hello " + req.session.name + "!");
  }else{
    
    if(typeof req.query.name != 'undefined'){
      // Open a new session
      console.log(req.query.name);
      req.session.name = req.query.name;
      res.redirect("/");
    }else{
    
      // Define template
      let htmlContent = `
      <form action="/">
        What is your name ?
        <input type="text" name="name">
        <input type="submit" value="Submit">
      </form>`;
  
      // Render View
      res.send(htmlContent);
    }
  }

})

// Create a critical endpoint
app.get('/order', (req, res) => {

  if (typeof req.session.name!= 'undefined'){
      // Session already exist
      res.send(req.session.name + ", <br> We have take into consideration your order and your bank account will be debited in few days");
  }else{
      res.redirect("/");
  }
})

// Start Application
//http.createServer(app).listen(3000);
https.createServer(tlsOptions, app).listen(3000);
