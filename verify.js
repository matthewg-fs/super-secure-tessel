/*********************************************
This basic RFID example listens for an RFID
device to come within range of the module,
then logs its UID to the console.
*********************************************/
const https = require('https');
var tessel = require('tessel');
var rfidlib = require('rfid-pn532');
const ipAdress = '172.16.22.214:3000'

var rfid = rfidlib.use(tessel.port['A']);

rfid.on('ready', function (version) {
  console.log('Ready to read RFID card');

  rfid.on('data', function(card) {
    let currentCard = '0207be03' //card.uid.toString('hex');
    https.get(ipAdress + '/' + currentCard, res => {
        console.log(res);
    })

  });
});

rfid.on('error', function (err) {
  console.error(err);
});