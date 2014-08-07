var mongoose = require('mongoose');
var Schema   = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var serverdataSchema = new Schema({
	server_id: String,
	cpu: {
		count: {type:  Number, default: 1},
		count_logical: {type:  Number, default: 1},
		per: Array
	},
	memory: {
		total: Number,
		avail: Number,
		per: Number,
		used: Number,
		free: Number
	},
	swap: {
		total: Number,
		used: Number,
		free: Number,
		per: Number,
		sin: Number,
		sout: Number
	},
	disk: {
		part: Schema.Types.Mixed,
		usage: Schema.Types.Mixed
	},
	network: Schema.Types.Mixed,
	users: Array,
	boot_time: Number,
	date: {type: Date, default: Date.now},
});

var objModel = mongoose.model('ServerData', serverdataSchema);

exports.ServerData = objModel;
exports.Model = objModel;