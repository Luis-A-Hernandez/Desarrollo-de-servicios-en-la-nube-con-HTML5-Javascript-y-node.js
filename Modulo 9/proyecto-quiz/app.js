var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var routes = require('./routes/index');
var methodoverride = require('method-override');
var session = require('express-session');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(methodoverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(
    {
        secret: 'supersecretsecret',
        resave: false,
        saveUninitialized: true
    }
));

// MW helpers
app.use(function(req, res, next){

    if(!req.path.match(/\/login/)) {
        req.session.redir = req.path;
    }

    if (req.session.user) {
        var time = new Date().getTime();
        req.session.lastReq = req.session.lastReq || time;
        var sessionExpired = (time - req.session.lastReq) > 120000;
        console.log(time +" ----- "+ sessionExpired +" ----- "+ req.session.lastReq);

        if (sessionExpired){
            console.log("------------- session expirada ----------------");
            delete req.session.user;
            delete req.session.lastReq;
            req.session.errors = [{"message": "La sesion a caducado. Ingrese de nuevo su Login y Password"}];
            res.redirect('login');
            return;
        } else {
            req.session.lastReq = time;
        };
    }

    res.locals.session = req.session;
    next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors:[]
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors:[]
    });
});


module.exports = app;
