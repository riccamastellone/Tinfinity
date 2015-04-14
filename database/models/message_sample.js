var mongoose = require('mongoose');

//define the schema
var MessageSampleSchema = new mongoose.Schema({
  message: String,
  updated_at: { type: Date, default: Date.now },
});

//export the model
module.exports = mongoose.model('MessageSample', MessageSampleSchema);
