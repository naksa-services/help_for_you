const { json } = require('body-parser');
const express = require('express');
const bodyparser = require('body-parser');
var app = express();
app.use(express.json());

console.log("working project ");
//router
const user = require('./src/md_club/business');
const partVisit = require('./src/md_club/mdMember');
app.use('/qr', express.static('business_qr'));
app.use('/business', express.static('business/image'))
app.use(bodyparser.json());
app.use(user);
app.use(partVisit);


app.listen(process.env.PORT || 5000);