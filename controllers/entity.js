var mongodb = require('../db');
var extend = require('extend');

exports.find = function(req, res, apiUser)
{
	var model = require('../model/' + req.params.entity + '.js');
	var conditions = req.body;
	
	model.Model.find(conditions, function(err, data){
		if (err) {
			res.send(err);
			res.statusCode = 500;
		} else {
			res.send(data);
		}
	})
}

exports.insert = function(req, res) {
	var model = require('../model/' + req.params.entity + '.js');
	var document = req.body;
	console.log('inserted');

	object = new model.Model(document);

	object.save(function(e) {
		if (req.params.entity === 'serverdata') {
		//here goes the real time
			req.io.broadcast('updated_' + object.server_id, object);
		}
		res.send(object);	
	});
}

exports.save = function(req, res)
{
	var model = require('../model/' + req.params.entity + '.js');
	var document = req.body.document;
	var conditions = req.body.conditions;

	if (typeof document._id !== 'undefined') {
		delete document._id;
	}

	if (typeof document.created !== 'undefined') {
		delete document.created;
	}

	if (req.params.entity === 'user') {
		if (typeof document.email !== 'undefined') {
			delete document.email;
		}

		if (typeof document.plan !== 'undefined') {
			delete document.plan;
		}
	}

	model.Model.update(conditions, {$set: document }, function(err, newDocument){
		if (err) {
			console.log(err);
		} else {
			if (req.params.entity === 'user') {
				req.session.user = extend(req.body.document, req.session.user);
			}
		}

		res.send(req.body.document);
	});
}