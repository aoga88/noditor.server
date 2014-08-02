var mongodb = require('../db');
var extend = require('extend');

exports.find = function(req, res)
{
	res.send(req.params);
}

exports.save = function(req, res)
{
	console.log(req.params);
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