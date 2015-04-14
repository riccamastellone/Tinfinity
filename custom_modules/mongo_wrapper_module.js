var mongoose = require('mongoose');

module.exports = {

    /*---------------------- Mongo common methods ----------------------*/

        //find all the elements of a given model
        find : function(model, callback){

            model.find(function (err, results) {
                if (err) return next(err);
                callback(results)
            });

        },

        //create an element of a given model
        create : function(model, params, callback){

            model.create(params, function (err, created) {
                if (err) return next(err);
               callback(created)
            });

        }

};





