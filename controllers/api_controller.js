// EXPORTING NECESSARY MODULES
// ------------------------------------------------------
var express = require('express');
var youTubeNode  = require('youtube-node');

// INITIALIZE EXPRESS APP
// ------------------------------------------------------
var app = express();
var youTube = youTubeNode();
var router = express.Router();

router.get('/', (req,res) =>{
    res.render('index')
})

router.post('/', (req,res) => {
    res.render('index')
})

router.get('/play', (req,res) => {
    res.render('play')
})

module.exports = router;