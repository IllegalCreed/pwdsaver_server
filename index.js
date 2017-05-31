var express = require('express')
var app = express()
var router = require('./router')
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use('/api', router);


app.listen(3000, function () {
	console.log('Example app listening on port 3000!')
})