var express = require('express');
var path = require('path');
var swig = require('swig');
var config = require('./config');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var error = require('./app/helpers/error');
var session = require('./app/helpers/session');

var app = express();
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/app/views');
// Optional: use swig's caching methods
// app.set('view cache', false);

app.disable('x-powered-by');
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/components', express.static(path.join(__dirname, 'bower_components')));
app.use(session.getCurrentUser);
app.use(function(req, res, next) {
  res.locals.cookies = req.cookies;
  res.locals.currentUser = req.user;
  next();
});

// Routes
app.use('/', require('./app/routes/index'));
app.use('/pages', require('./app/routes/pages'));
app.use('/users', require('./app/routes/users'));
app.use('/styles', require('./app/routes/styles'));

// catch 404 and forward to error handler
app.use(error.notFound);

// error handlers
app.use(error.handler);

// Run
app.listen(config.serverPort);
console.log('Application Started on http://localhost:' + config.serverPort + '/');
