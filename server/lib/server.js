var express = require('express'),
    photbox = require('./photbox');
bodyParser = require('body-parser');
var app = express();

app.use(express.static(__dirname + '/../../client/dist'));
app.use('/photos', express.static(__dirname + '/../photos'));
app.use(bodyParser.json());

/**
 * CORS support.
 */
app.all('*', function (req, res, next) {
    if (!req.get('Origin')) return next();
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE');
    res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
    // res.set('Access-Control-Allow-Max-Age', 3600);
    if ('OPTIONS' === req.method) return res.send(200);
    next();
});

app.get('/api/photo', function (req, res) {
    photbox.take().then(function (result) {
        res.json(result);
    }, function (err) {
        res.status(500).json({
            error: err
        });
    });
});

app.get('/api/connect', function (req, res) {
    photbox.connectCam().then(function (result) {
        res.json(result);
    }, function (err) {
        res.status(500).json({
            error: err
        });
    });
});

app.get('/api/status', function (req, res) {
    photbox.status().then(function (result) {
        res.json(result);
    }, function (err) {
        res.status(500).json({
            error: err
        });
    });
});

function startServer() {
    var port = 3000;
    app.listen(port, function () {
        console.log('express server started at port ' + port + '...');
    });
}

module.exports = {
    start: startServer
};