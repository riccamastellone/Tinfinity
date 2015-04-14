var mongoose = require('mongoose');

module.exports = {

    /*---------------------- Mongo common methods ----------------------*/

        find : function(model, callback){

            model.find(function (err, results) {
                if (err) return next(err);
                console.log(results)
                callback(results)
            });

        },

        create : function(model, callback){

            model.create({message : "ciao come va3?"}, function (err, created) {
                if (err) return next(err);
               callback(created)
            });

        }

};





