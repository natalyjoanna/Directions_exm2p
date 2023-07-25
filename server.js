const express = require("express");
const path = require("path");

var app = express();

app.use(express.static(path.join(__dirname, 'javascript')));
app.use(express.static(path.join(__dirname, 'styles')));
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static('/assets/'));

app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname + '/views/index.html'))
})

app.get('/directions', function(request, response) {
    response.sendFile(path.join(__dirname + '/views/directions.html'))
})

app.listen(3000);