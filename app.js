const express = require('express');
const app = express(); 
const path = require('path');

app.use(express.urlencoded({ extended: true }))

const mustache = require('mustache-express');
app.engine('mustache', mustache());
app.set('view engine', 'mustache');

app.set('views', __dirname + '/public/views');
app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Content-Type', 'text/html')
    next();
});

const routes = require('./routes/route');
app.use("/", routes); 

const PORT = 8080; //const PORT = process.env.PORT || 8080
app.listen(PORT, function() {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
})