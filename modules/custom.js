exports.filterUser = function(doc) { 

  	if(doc === null) {
  		return { error : "User does not exist"};
  	}    

  	// Dati pubblici
  	data = {
		 	_id : doc._id, 
			name : doc.name, 
			surname : doc.surname.charAt(0) + ".", 
			gender : doc.gender,
			relationship : null 
		};

    if(User.hasOwnProperty('relationships') === false || typeof User.relationships[doc._id] === 'undefined') {
      return data;
    }

	// Relazione accettata, aggiungiamo informazioni
    if(User.relationships[doc._id] === 'accepted') {
    	var moment = require('moment');
    	
    	data.surname = doc.surname;
    	data.image = doc.image;
    	data.relationship = "accepted";
    	data.age = moment().diff(doc.birthdate, 'years');
	} 

	return data;
	
}