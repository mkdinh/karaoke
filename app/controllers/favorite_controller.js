var express = require('express');
var router = express.Router();
var db = require('../models');
var Favorite = db.Favorite;

router.get("/all", (req,res) =>{
    Favorite.findAll({order: [['id', 'DESC']]})
    .then((allSongs) => {
        res.json(allSongs)
    })
});

router.post('/', (req,res) =>{
    Favorite.create(req.body)
    .then((song) => {
        res.json(song)
    })
});

router.put('/:id', (req,res) => {
});

router.delete('/:id', (req,res) => {
    Favorite.destroy({where: {song_id: req.params.id} })
    .then( () => {
        res.end();
    })
});



module.exports = router;