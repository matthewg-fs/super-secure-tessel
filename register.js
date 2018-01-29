var tessel = require('tessel');
var rfidlib = require('rfid-pn532');
var http = require('http');
var querystring = require('querystring');

var rfid = rfidlib.use(tessel.port['A']);
var firstRead = true;

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

rfid.on('ready', function (version) {
  console.log('Ready to read RFID card');

  rfid.on('data', function(card) {
    if(firstRead) {
      console.log('Registering UID:', card.uid.toString('hex'));
      postRFID(card.uid.toString('hex'));
      firstRead = false;
    }
  });
});

rfid.on('error', function (err) {
  console.error(err);
});
