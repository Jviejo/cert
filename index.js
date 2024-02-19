const express = require('express');

const https = require('https');
const fs = require('fs');
const path = require('path');
const app = express();
require('dotenv').config()

// console.log(process.env.PRIVATE.split("\\n").join("\n"))

const key = process.env.PRIVATE.split("\\n").join("\n")
https.createServer({
    cert: fs.readFileSync(path.join(__dirname, 'fullchain.pem')),
    //key: fs.readFileSync(path.join(__dirname, 'privkey.pem')),
    key: key,

    // ca: [fs.readFileSync(path.join(__dirname, 'rootCA.crt'))],


    requestCert: true,
    rejectUnauthorized: false,
}, app).listen(process.env.PORT | 8433, function () {
    console.log(`Servidor https correindo en el puerto ${process.env.PORT | 8443}`);
});


app.get('/', async function (req, res) {
    const cert = Buffer.from(JSON.stringify(req.socket.getPeerCertificate())).toString("base64Url")
    res.redirect(`${req.query.url}/cert=${cert}`)
})