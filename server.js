// EXPORTING NECESSARY MODULES
// ------------------------------------------------------
var express = require('express');
var hdbs = require('express-handlebars');
var path = require('path');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var db = require('./app/models');

// INITIALIZE EXPRESS APP
// ------------------------------------------------------
var app = express();
var port = process.env.PORT || 3000;

db.sequelize.sync(
    // {force:true}
)
.then(() => {
    app.listen(port, function(){
        console.log('listen to port', port)
    });
})

// SETTINGS FOR EXPRESS APP
// ------------------------------------------------------
app.engine('handlebars', hdbs({defaultLayout: 'main', layoutsDir: path.join(__dirname,'app/views/layouts') }));
app.set('view engine','handlebars');

app.use(methodOverride('_method'));
app.set('views',path.join(__dirname,'./app/views'))
app.use(express.static(path.join(__dirname,'app/public/')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use('/', require('./app/controllers/html_controller.js'))
app.use('/fav', require('./app/controllers/favorite_controller.js'))
app.use('/song', require('./app/controllers/song_controller.js'))
