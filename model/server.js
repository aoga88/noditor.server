var mongoose = require('mongoose');
var Schema   = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var serverSchema = new Schema({
	name: String,
	os: String,
	distro: String,
	configuration: {
		memory: {type: Boolean, default: false},
		cpu: {type: Boolean, default: false},
		disk: {type: Boolean, default: false},
		bandwith: {type: Boolean, default: false}
	},
	user: String,
	created: {type: Date, default: Date.now},
	active: {type: Boolean, default: true},
	deleted: {type: Boolean, default: false},
});

var objModel = mongoose.model('Server', serverSchema);

exports.Server = objModel;
exports.Model = objModel;