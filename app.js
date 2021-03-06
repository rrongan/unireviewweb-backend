/*
* Express session https://www.codementor.io/emjay/how-to-build-a-simple-session-based-authentication-system-with-nodejs-from-scratch-6vn67mcy3
* */
/* eslint no-console: "off"*/

var express = require('express');
var session = require('express-session');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var index = require('./routes/index');
var main = require('./routes/main.js');
var student = require('./routes/student.js');
var college = require('./routes/college.js');
var authentication = require('./routes/authentication.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
	key: 'user_sid',
	secret: 'unireviewweb',
	resave: false,
	saveUninitialized: false,
	cookie: {
		secure: false,
		maxAge: 60000,
		httpOnly: false
	}
}));

//open mongo database
if(process.env.NODE_ENV !== 'test') {
	mongoose.connect('mongodb://localhost:27017/unireviewdb');
	var db = mongoose.connection;
	db.on('error', function (err) {
		console.log('connection error', err);
	});
	db.once('open', function () {
		console.log('connected to database');
	});
}

app.use('/', index);
app.get('/main',authentication.sessionChecker, main.main);

app.post('/auth/login', authentication.login);
app.get('/auth/logout', authentication.logout);

app.get('/student', student.findAll);
app.get('/student/:id', student.findOne);
app.post('/student', student.addStudent);
app.delete('/student/:id', student.deleteStudent);
app.put('/student/:id', student.editStudent);
app.put('/student/:id/password', student.editStudentPassword);
app.post('/student/search', student.search);

app.get('/college', college.findAll);
app.get('/college/:id', college.findOne);
app.post('/college', college.addCollege);
app.delete('/college/:id', college.deleteCollege);
app.put('/college/:id', college.editCollege);
app.post('/college/search', college.search);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
app.use((req, res, next) => {
	if (req.cookies.user_sid && !req.session) {
		res.clearCookie('user_sid');
	}
	next();
});

module.exports = app;
