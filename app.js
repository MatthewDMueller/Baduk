const express = require('express');
const nunjucks = require('nunjucks');
var sassMiddleware = require('node-sass-middleware');
var path = require('path');
const app = express();
const routes = require('./routes');
const router = express.Router();
const http = require('http');

app.use(sassMiddleware({
    /* Options */
    src: path.join(__dirname, 'public/styles'),
    dest: path.join(__dirname, 'public/styles'),
    debug: true,
    //outputStyle: 'compressed',
    prefix:  '/styles'  // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
}));

//mount static resources (after compling sass)
app.use('/', express.static(path.join(__dirname, 'public')));

//connect all our routes to our application
app.use('/', routes);

//set views directory
app.set('views', __dirname + '/views');
app.set('view engine', 'nunjucks');

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.get('/', function(req, res) {
    res.render('index.njk');
});

//random middleware function
var requestTime = function (req, res, next) {
    req.requestTime = Date.now();
    next();
}
app.use(requestTime);

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

// set the port of our application
// process.env.PORT lets the port be set by Heroku
// var port = process.env.PORT || 8080;
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('boot...');
});

/*
http.createServer(function (req, res) {
    console.log('boot...');
    //res.writeHead(200, {'Content-Type': 'text/plain'});
    //res.end('Hello, world! [helloworld sample]'); 
}).listen(port, function () { console.log('boot...'); });
*/
