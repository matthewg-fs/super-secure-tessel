/*********************************************
This basic RFID example listens for an RFID
device to come within range of the module,
then logs its UID to the console.
*********************************************/
const http = require('http');
var tessel = require('tessel');
var rfidlib = require('rfid-pn532');
const ipAdress = 'http://172.16.22.214:3000'

var rfid = rfidlib.use(tessel.port['A']);

rfid.on('ready', function (version) {
  console.log('Ready to read RFID card');

  rfid.on('data', function(card) {
    //let currentCard = '0207be03'
    let currentCard = card.uid.toString('hex');
    http.get(ipAdress + '/' + currentCard, res => {
        console.log(res.statusCode);
    })

  });
});

rfid.on('error', function (err) {
  console.error(err);
});
