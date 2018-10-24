var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");
const Nexmo = require('nexmo');
const nexmo = new Nexmo({
  apiKey: 'd8cbbd84',
  apiSecret: '39kEuK1BaXxDr62D'
});

//Get home Page
router.get('/', function(req, res){
        res.render('index');
});



/* GET home page. */
router.post('/register', function(req, res) {
        let phoneNumber = req.body.number;
        console.log(phoneNumber);
        nexmo.verify.request({number: phoneNumber, brand: 'Psy Company'}, (err, 
          result) => {
            if(err) {
              res.sendStatus(500);
            } else {
              let requestId = result.request_id;
              if(result.status == '0') {
                res.render('verify', {requestId: requestId}); // Success! Now, have your user enter the PIN
              } else {
                res.status(401).send(result.error_text);
              }
            }
          });
});

router.get('/verify', (req, res) => {
      res.render('verify');
})


router.post('/verify', (req, res) => {
  let pin = req.body.pin;
  let requestId = req.body.requestId;
 
  nexmo.verify.check({request_id: requestId, code: pin, pin_expiry: 60}, (err, result) => {
    if(err) {
      // handle the error
      res.sendStatus(500);
    } else {
      if(result && result.status == '0') { // Success!
        res.status(200).send('Account verified!');
        res.render('status', {message: 'Account verified! 🎉'});
      } else {
        // handle the error - e.g. wrong PIN
      }
    }
  });
});

module.exports = router;
