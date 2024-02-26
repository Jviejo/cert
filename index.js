const express = require('express');

const https = require('https');
const fs = require('fs');
const path = require('path');
const app = express();
const axios = require('axios')
require('dotenv').config()

console.log(process.env.PORT)
PORT = process.env.PORT 

const key = process.env.PRIVATE.split("\\n").join("\n")
https.createServer({
    cert: fs.readFileSync(path.join(__dirname, 'fullchain.pem')),
    //key: fs.readFileSync(path.join(__dirname, 'privkey.pem')),
    key: key,

    // ca: [fs.readFileSync(path.join(__dirname, 'rootCA.crt'))],


    requestCert: true,
    rejectUnauthorized: false,
}, app).listen(PORT, function () {
    console.log(`Servidor https correindo en el puerto ${PORT}`);
});



app.get('/', async function (req, res) {
    try {
        const cert = Buffer.from(JSON.stringify(req.socket.getPeerCertificate())).toString("base64Url")
        const data = await axios.post(`${req.query.url}/api/fun/${req.query.idOrga}/cert`,
            {
                cert: cert
            }
        )
        // console.log(data.data.token)
        res.redirect(`${req.query.url}/?token=${data.data.token}`)
    }
    catch (err) {
        console.log(err)
        console.log(`error ${req.query.url}/api/fun/${req.query.idOrga}/cert`)
        res.redirect(`${req.query.url}/api/fun/${req.query.idOrga}/cert?error=se ha producido un error`)
    }
})


module.exports = app;