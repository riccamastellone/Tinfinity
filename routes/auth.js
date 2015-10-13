var express = require('express');
var router = express.Router();
var https = require('https');
var request = require("request");
var moment = require('moment');
/**
 * /api/auth/fb
 * Autentico il client. Nel body della post mi aspetto il token
 * returns { .. }
 */
router.post('/fb', function(req, res, next) {

	var db = req.db;
  	var users = db.get('users');
	var fb_token = req.body.token;

	var base = "https://graph.facebook.com/v2.3";

	https.get(base + "/me?fields=picture.type(large),first_name,last_name,gender,id,birthday,email&access_token=" + fb_token, function(obj) {
		var body = '';

	    obj.on('data', function(chunk) {
	        body += chunk;
	    });
 		obj.on('end', function () {
 			fb_data = JSON.parse(body);

 			// Gestiamo gli errori di Facebook
 			if(typeof fb_data.error !== 'undefined') {
          		res.json({'error' : fb_data.error});
          		return;
          	}
		    // Sia che esista, che non, creiamo un nuovo token di accesso
	    	var token = require('crypto').randomBytes(32).toString('hex');

	    	// Recuperiamo l'immagine così da averla in locale e servirla in base64
	    	request({
		      uri: fb_data.picture.data.url,
		      encoding: 'binary'
		    }, function(error, response, body) {
		      var image;
		      if (!error && response.statusCode === 200) {
		        image = new Buffer(body.toString(), "binary").toString("base64");
		        // E aggiorniamo tutti i dati presi da facebook
		    	var user = {
	                name : fb_data.first_name,
	                surname : fb_data.last_name,
	                gender : fb_data.gender,
	                facebook_id : fb_data.id,
	                birthdate : fb_data.birthday,
	                token : token,
	                updated_at : Date.now()
	          	}

	          	users.update({ facebook_id : fb_data.id},
	          		// Aggiungiamo l'immagine solo se è un nuovo inserimento
					{ $set : user, $setOnInsert: { 
						created_at: Date.now(), 
						images : { '0' : image },
						relationships : {}
						 } },
					{ upsert: true }, function(err, doc){
						if(err) throw err;
						// Pare la callback dell'update non ritorni l'oggetto, 
						// quindi lo andiamo a ripescare così
						users.findOne({ facebook_id : fb_data.id},function(err,doc){
							doc['age'] = moment().diff(new Date(doc.birthdate), 'years');
							res.json(doc);
						});
				});
		      }
		    });

		  });
	}).on('error', function(e) {
		res.json({'error' : e.message})
	});

});


module.exports = router;