var express = require('express');
var router = express.Router();
var db = require('../models');
var Song = db.Song;

router.get('/all', (req,res) => {
    Song.findAll()
    .then((songs) => {
        res.json(songs)
    })
})

router.post('/:id', (req,res) => {
    console.log(req.body)
    Song.create(req.body)
    .then((data) => {
        res.json(data)
    })
})


router.delete('/:id', (req,res) => {
    if(req.params.id === 'all'){
        Song.destroy({where: {} })
        .then(() => {
            res.end();
        })  
    }else{
        Song.destroy({where: {song_id: req.params.id} })
        .then(() => {
            res.end();
        })
    }
})


module.exports = router;