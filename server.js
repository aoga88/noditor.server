#!/bin/env node
//  Noditor Server
var mongoose = require('mongoose');
var app      = require('express.io')(),
    swig     = require('swig');
var fs       = require('fs');
var express  = require('express.io');
//var io = require('socket.io')(app);

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
app.http().io();

var mongodb = require('./db');
var model_user = require('./model/user');
var model_server = require('./model/server');

function setupVariables() {
    var ipaddress = process.env.OPENSHIFT_NODEJS_IP;
    var port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

    if (typeof ipaddress === "undefined") {
        console.warn('No OPENSHIFT_NODEJS_IP var, using 0.0.0.0');
        ipaddress = "0.0.0.0";
    };

    return {
        ip:   ipaddress,
        port: port
    };
};

model_server.Model.find({}, function(err, servers){
    if (!err) {
        servers.forEach(function(server){
            app.io.route('server_' + server._id, function(req){
                console.log(req);
                console.log('emiting: ' + 'updated_' + server._id);
                app.io.broadcast('updated_' + server._id, req.body);
            })
        })
    }
});

var userController    = require('./controllers/user'),
    indexController   = require('./controllers/index'),
    entityController  = require('./controllers/entity'),
    appController     = require('./controllers/app'),
    monitorController = require('./controllers/monitor'),
    serverController  = require('./controllers/server');

var routes = [
    {
        route: '/',
        action: indexController.index,
        method: 'get',
        login:   false
    },
    {
        route: '/about',
        action: indexController.about,
        method: 'get',
        login:   false
    },
    {
        route: '/support',
        action: indexController.support,
        method: 'get',
        login:   false
    },
    {
        route: '/login',
        action: userController.login,
        method: 'get',
        login:   false
    },
    {
        route: '/logout',
        action: userController.logout,
        method: 'get',
        login:   false
    },
    {
        route: '/signup',
        action: userController.signup,
        method: 'get',
        login:   false
    },
    {
        route: '/signup',
        action: userController.signupAction,
        method: 'post',
        login:   false
    },
    {
        route: '/api/:entity/find',
        action: entityController.find,
        method: 'post',
        login:   true
    },
    {
        route: '/api/:entity',
        action: entityController.save,
        method: 'post',
        login:   true
    },
    {
        route: '/api/:entity',
        action: entityController.insert,
        method: 'put',
        login:   true
    },
    {
        route: '/api/user/login',
        action: userController.loginAction,
        method: 'post',
        login:   false
    },
    {
        route: '/app',
        action: appController.index,
        method: 'get',
        login:   true
    },
    {
        route: '/app/profile',
        action: appController.profile,
        method: 'get',
        login:   true
    },
    {
        route: '/app/profile/change-password',
        action: appController.changePassword,
        method: 'get',
        login:   true
    },
    {
        route: '/app/monitor',
        action: monitorController.index,
        method: 'get',
        login:   true
    },
    {
        route: '/app/monitor/server',
        action: serverController.index,
        method: 'get',
        login:   true
    },
    {
        route: '/app/monitor/server/new',
        action: serverController.new,
        method: 'get',
        login:   true
    },
    {
        route: '/app/monitor/server/:id',
        action: serverController.info,
        method: 'get',
        login:   true
    },
];

routes.forEach(function(element){
    var apiUser = null;
    
    if (element.method === 'get')
    {
        app.get(element.route, function(req, res) {
            if (element.login === true) {
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

            if (element.login === true) {
                if (typeof req.headers.authorization !== 'undefined') {
                    var token=req.headers.authorization.split(/\s+/).pop()||'';
                    var auth1  = new Buffer(token, 'base64').toString();
                    parts=auth1.split(/:/);
                    email=parts[0];
                    id=parts[1];
                    
                    model_user.User.findOne({email: email, _id: id}, function(err, data){
                        if (!err) {
                            apiUser = data;
                            console.log(apiUser);
                        }
                    });
                }

                setTimeout(function() {
                    if (typeof req.session.user === 'undefined' && apiUser === null) {
                        res.send({ok: false, message: 'notLoggedIn'});
                        return;
                    }
                }, 1000);

                
            }

            element.action(req, res, apiUser);
        });
    }

    if (element.method === 'put')
    {
        app.put(element.route, function(req, res) {
            if (element.login === true) {
                if (typeof req.headers.authorization !== 'undefined') {
                    var token=req.headers.authorization.split(/\s+/).pop()||'';
                    var auth1  = new Buffer(token, 'base64').toString();
                    parts=auth1.split(/:/);
                    email=parts[0];
                    id=parts[1];
                    
                    model_user.User.findOne({email: email, _id: id}, function(err, data){
                        if (!err) {
                            apiUser = data;
                            console.log(apiUser);
                        }
                    });
                }

                setTimeout(function() {
                    if (typeof req.session.user === 'undefined' && apiUser === null) {
                        res.send({ok: false, message: 'notLoggedIn'});
                        return;
                    }
                }, 1000);
            }

            element.action(req, res, apiUser);
        });
    }

});

var config = setupVariables();
app.listen(config.port,  config.ip, function(){
    console.log('Application Started on http://' + config.ip + ':' + config.port + '/');
});