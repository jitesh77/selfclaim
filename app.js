/**
 * Created by: Varun kumar
 * Date: 25 December, 2017
 */

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');

// will log requests to the console so we can see what is happening
//const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const env = process.env.NODE_ENV || 'development';
const config = require('./config/config.json')[env];
const sanitizeRequest = require('./modules/sanitizeRequest');

/**
 * Get all routes here
 */
const indexRoutes = require('./routes/index'); // public facing routes, no login required
const dashboardRoutes = require('./routes/dashboard'); // complete flow for creating self-claim, login required
const homeRoutes = require('./routes/home'); // user's home page, login required
const adminRoutes = require('./routes/admin'); // admin's dashboard, login required

const app = express();

// setting view engine as ejs with file extension .html
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

/*app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));*/

app.use(bodyParser.json({
    limit: '8mb'
})); // support json encoded bodies

app.use(bodyParser.urlencoded({
    limit: '8mb',
    extended: true
})); // support encoded bodies

app.use(cookieParser());

app.use(config.baseUrl, express.static(path.join(__dirname, 'public')));

// logging POST Requests and parameters, sanitizing request payload
app.use(function(req, res, next) {
    if (req.method == 'POST') {
        console.log('\x1b[36m%s\x1b[0m', 'Request URL:', req.originalUrl);
        console.log(req.body);
        console.log('\x1b[33m%s\x1b[0m', '---------------------------------');

        req.body = sanitizeRequest(req.body);
    }
    next();
});

/**
 * Set all routes here, orders are important
 */
app.use(config.baseUrl, indexRoutes);
app.use(config.baseUrl + '/dashboard', dashboardRoutes);
app.use(config.baseUrl + '/home', homeRoutes);
app.use(config.baseUrl + '/admin', adminRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    console.log(err);
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
