var express = require('express');
var app = express();
var port = process.env.port || 3000;
var routes = require('./routes/main.js');

app.use(express.static(__dirname));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

routes(app, __dirname);

app.listen(port);