var mongodb = require('../db');
var model_user = require('../model/user.js');
var crypto = require('crypto');
var random = require('../lib/randomValues.js');
var Mailgun = require('mailgun-js');
var domain = "noditor.me";

exports.login = function(req, res)
{
	if (typeof req.session.user === 'undefined') {
		res.render("layouts/login");
	} else {
		res.redirect('/app');
	}
}

exports.logout = function(req, res) {
	delete req.session.user;
	res.redirect('/login');
}

exports.signup = function(req, res)
{
	if (typeof req.session.user === 'undefined') {
		res.render("layouts/signup");
	} else {
		res.redirect('/app');
	}
}

exports.signupAction = function(req, res)
{
	var user = req.body;
	var plainPassword = random.randomValues(8);
	var shasum = crypto.createHash('sha1');
	shasum.update(plainPassword);
	user.password = shasum.digest('hex');

	var mailgun = new Mailgun({
		apiKey: process.env.MAILGUN_APIKEY || 'key-9mh0z2vm6cxwa25iq3wmumzuh1m92hr2',
		domain: domain
	});

	var htmlText = "<html> \
		<h1>Welcome to noditor.me</h1> \
		<p> \
			Welcome to noditor.me, now your account has been created. \
		</p> \
		<p> \
			We have created a password for you, but you can update it anytime at your profile page. \
			<br/> \
			Your account information is: \
		</p> \
		<table> \
			<tr> \
				<td>User:</td> \
				<td>" + user.email + "</td> \
			</tr> \
			<tr> \
				<td>Name:</td> \
				<td>" + user.name + "</td> \
			</tr> \
			<tr> \
				<td>Company: </td> \
				<td>" + user.company + "</td> \
			</tr> \
			<tr> \
				<td>Password:</td> \
				<td>" + plainPassword + "</td> \
			</tr> \
		</table> \
		<p> \
		If you have any problem, you can write a ticket in your support section or you can email us to support@noditor.me, \
		we will be happy to assit you. \
		</p> \
		<p> \
			Thanks for using noditor.me! \
		</p> \
	</html> \
	";

	var mailOptions = {
		from: "postmaster@noditor.me",
		to: user.email,
		subject: 'Welcome to noditor.me',
		html: htmlText,
	};

	mailgun.messages().send(mailOptions, function (error, body) {
	  console.log(body);
	});

	var objUser = new model_user.User(user);
	objUser.save(function(e) {
		res.redirect('/login');
	});
}

exports.loginAction = function(req, res) {
	
	if (typeof req.body.password === 'undefined' || typeof req.body.email === 'undefined')
	{
		res.statusCode = 500;
		res.send({login: false});
		return false;
	}
	model_user.User.findOne(req.body, function(err, user){
		if (user === null)
		{
			res.statusCode = 500;
			res.send({login: false});
		}else{
			delete user.password;
			req.session.user = user;
			res.send(user);
		}
	});
}