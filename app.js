const express = require('express');
const logger = require('morgan');
const dns = require('dns');
const app = express();

app.use(logger('dev'));
app.use('/lookup/:type/:url', function(req, res, next) {
    var type = req.params.type;
    var url = req.params.url;
    dns.resolve(url, type, function(err, records) {
        if (err) {
            switch(err.code) {
                case 'ENODATA':
                    res.json([]);
                default:
                    next(err);
            }
            return;
        }
        res.json(records);
    });
});

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.status);
});

module.exports = app;