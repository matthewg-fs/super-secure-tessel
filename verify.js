/*********************************************
This basic RFID example listens for an RFID
device to come within range of the module,
then logs its UID to the console.
*********************************************/
const http = require('http');
var tessel = require('tessel');
var rfidlib = require('rfid-pn532');
var servolib = require('servo-pca9685');
const ipAdress = 'http://172.16.22.214:3000'

var rfid = rfidlib.use(tessel.port['A']);
var servo = servolib.use(tessel.port['B']);

rfid.on('ready', function (version) {
  console.log('Ready to read RFID card');

  rfid.on('data', function(card) {
    //let currentCard = '0207be03'
    let currentCard = card.uid.toString('hex');
    http.get(ipAdress + '/' + currentCard, res => {
        if (res.statusCode === 200){
          servo.on('ready', function () {
            var position = 0;
            servo.configure(servo1, 0.05, 0.12, function () {
              position = 1;
              servo.move(servo1, position);
              setInterval(function () {
                position = 0;
                servo.move(servo1, position);
              }, 3000);
            });
          });
          console.log('Access Granted');
        } else {
          console.log('Access Denied')
        }
    })

  });
});

rfid.on('error', function (err) {
  console.error(err);
});
