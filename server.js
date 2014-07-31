#!/bin/env node
//  Noditor Server
var mongoose = require('mongoose');
var app      = require('express')(),
    swig     = require('swig');
var fs       = require('fs');
var express  = require('express');

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.set('view cache', false);
swig.setDefaults({ cache: false });
app.use(express.cookieParser());
app.use(express.session({secret: 'noditorjs'}));
app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser());
app.use(express.methodOverride());

function setupVariables() {
    var ipaddress = process.env.OPENSHIFT_NODEJS_IP;
    var port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

    if (typeof ipaddress === "undefined") {
        console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
        ipaddress = "127.0.0.1";
    };

    return {
        ip:   ipaddress,
        port: port
    };
};

var userController  = require('./controllers/user');
var indexController   = require('./controllers/index');

var routes = [
    {
        route: '/',
        action: indexController.index,
        method: 'get',
        auth:   false
    },
    {
        route: '/about',
        action: indexController.about,
        method: 'get',
        auth:   false
    },
    {
        route: '/support',
        action: indexController.support,
        method: 'get',
        auth:   false
    },
    {
        route: '/login',
        action: userController.login,
        method: 'get',
        auth:   false
    },
    {
        route: '/signup',
        action: userController.signup,
        method: 'get',
        auth:   false
    },
];

routes.forEach(function(element){
    if (element.method === 'get')
    {
        app.get(element.route, function(req, res) {
            if (element.auth === true) {
                if (typeof req.session.user === 'undefined') {
                    userController.login(req, res);
                    return;
                }
            }

            element.action(req, res);
        });
    }

    if (element.method === 'post')
    {
        app.post(element.route, function(req, res) {
            if (element.auth === true) {
                if (typeof req.session.user === 'undefined') {
                    res.send({ok: false, message: 'notLoggedIn'});
                    return;
                }
            }

            element.action(req, res);
        });
    }

});

var config = setupVariables();
app.listen(config.port,  config.ip, function(){
    console.log('Application Started on http://' + config.ip + ':' + config.port + '/');
});