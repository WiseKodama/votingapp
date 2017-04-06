var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pollSchema = new Schema({
   title:String,
   madeby:String,
   data:Array,
   results:Array,
   userList:Array,
   date:String
});

module.exports = mongoose.model('Poll',pollSchema);