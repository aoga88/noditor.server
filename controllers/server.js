var mongodb = require('../db');

exports.new = function(req, res) {
	var servers = 5;

	if (req.session.user.plan === 'business') {
		servers = 20;
	}

	if (req.session.user.plan === 'pro') {
		servers = 100;
	}

	res.render('app/server/new', {user: req.session.user, servers: servers});
}

exports.index = function(req, res) {
	var servers = 5;

	if (req.session.user.plan === 'business') {
		servers = 20;
	}

	if (req.session.user.plan === 'pro') {
		servers = 100;
	}
	res.render('app/server/index', {user: req.session.user, servers: servers});
}

exports.info = function(req, res) {
	var id = req.params.id;

	var model = require('../model/server.js');
	var conditions = {_id: id};

	model.Model.findOne(conditions, function(err, data){
		if (err) {
			res.redirect('/app/monitor/server');
		} else {
			res.render('app/server/info', {user: req.session.user, server: data});
		}
	})
}

exports.realTime = function(req, res) {
	res.render('app/server/real-time', req.session);
}