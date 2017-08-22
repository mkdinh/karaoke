// EXPORTING NECESSARY MODULES
// ------------------------------------------------------
var express = require('express');
var hdbs = require('express-handlebars');
var path = require('path');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

// INITIALIZE EXPRESS APP
// ------------------------------------------------------
var app = express();
var port = process.env.PORT || 3000;

app.listen(port, function(){
    console.log('listen to port', port)
});

// SETTINGS FOR EXPRESS APP
// ------------------------------------------------------
app.engine('handlebars', hdbs({defaultLayout: 'main'}));
app.set('view engine','handlebars');

app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname,'public/')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use('/', require('./controllers/api_controller.js'))

