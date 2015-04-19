exports.filterUser = function(doc) { 

  	if(doc === null) {
  		return { error : "User does not exist"};
  	}    
    /* 
    Vogliamo gestire anche questo caso?
    Meglio di no, teniamo pulito dall'altra parte usando users.findOne
    if(doc.isArray === true) {
      doc = doc[0];
    }
    */

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
    } else {
      data.relationship = User.relationships[doc._id];
    }

	// Relazione accettata, aggiungiamo informazioni
    if(User.relationships[doc._id] === 'accepted') {
    	var moment = require('moment');
    	
    	data.surname = doc.surname;
    	data.image = doc.image;
    	
    	data.age = moment().diff(doc.birthdate, 'years');
	} 

	return data;
	
}