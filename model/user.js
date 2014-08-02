var mongoose = require('mongoose');
var Schema   = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var userSchema = new Schema({
	name: String,
	company: String,
	city: String,
	country: String,
	role: String,
	website: String,
	email: String,
	password: String,
	plan: {type: String, default: 'basic'},
	created: {type: Date, default: Date.now},
	active: {type: Boolean, default: true},
	deleted: {type: Boolean, default: false},
});

var objModel = mongoose.model('User', userSchema);

exports.User = objModel;
exports.Model = objModel;