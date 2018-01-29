var tessel = require('tessel');
var rfidlib = require('rfid-pn532');
var http = require('http');
var querystring = require('querystring');
var servolib = require('servo-pca9685');

var rfid = rfidlib.use(tessel.port['A']);
var firstRead = true;
var servo = servolib.use(tessel.port['B']);
const servo1 = 1;
const ipAdress = 'http://172.16.22.214:3000'

function postRFID(rfId) {
  // Build the post string from an object
  var post_data = querystring.stringify({
      'rfId' : rfId
  });

  // An object of options to indicate where to post to
  var post_options = {
      host: '172.16.22.214',
      port: '3000',
      path: '/',
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(post_data)
      }
  };

  // Set up the request
  var post_req = http.request(post_options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
          console.log('Response: ' + chunk);
      });
  });

  // post the data
  post_req.write(post_data);
  post_req.end();
}

servo.on('ready', function () {
  var position = 0;
  servo.configure(servo1, 0.05, 0.12, function () {
    servo.move(servo1, position);
    console.log('Gate Ready');
    rfid.on('ready', function (version) {
      console.log('Ready to read RFID card');

      rfid.on('data', function(card) {
        if(firstRead) {
          console.log('Registering UID:', card.uid.toString('hex'));
          postRFID(card.uid.toString('hex'));
          firstRead = false;

          const av = require('tessel-av');
          const camera = new av.Camera();
          const capture = camera.capture();
          capture.on('data', function(data) {
            console.log('Camera data:', data);
          })
        } else {
          let currentCard = card.uid.toString('hex');
          http.get(ipAdress + '/' + currentCard, res => {
            if (res.statusCode === 200) {
              position = 0.5;
              servo.move(servo1, position);
              setTimeout(function () {
                position = 0;
                servo.move(servo1, position);
              }, 3000);
              console.log('Access Granted');
            } else {
              console.log('Access Denied')
            }
          })
        }
      });
    });
  });
});

rfid.on('error', function (err) {
  console.error(err);
});
