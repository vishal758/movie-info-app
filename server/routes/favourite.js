const express = require('express');
const router = express.Router();
const { Favourite } = require("../models/Favourite");

const { auth } = require("../middleware/auth");

//=================================
//             Favourite
//=================================


router.post("/favouriteNumber", auth, (req, res) => {
    let variable = {}
    if (req.body.movieId) {
        variable = {movieId: req.body.movieId}
    } else if (req.body.serieId) {
        variable = {serieId: req.body.serieId}
    }
    // Favourite.find({"movieId": req.body.movieId})
    Favourite.find(variable)
        .exec((err, favourite) => {
            if(err) {
                return res.status(400).send(err)
            }
            res.status(200).json({success: true, favouriteNumber: favourite.length})
        })
});

router.post("/favourited", auth, (req, res) => {
    let variable = {}
    if (req.body.movieId) {
        variable = {movieId: req.body.movieId, userFrom: req.body.userFrom }
    } else if (req.body.serieId) {
        variable = {serieId: req.body.serieId, userFrom: req.body.userFrom }
    }
    // Favourite.find({"movieId": req.body.movieId, "userFrom": req.body.userFrom })
    Favourite.find(variable)
        .exec((err, favourite) => {
            if(err) return res.status(400).send(err)
            
            let result = false
            if(favourite.length !== 0) {
                result = true
            }
            res.status(200).json({success: true, favourited: result})
        })
});

router.post("/addToFavourite", auth, (req, res) => {

    const favourite = new Favourite(req.body)
    favourite.save((err, doc) => {
        if(err) res.json({success: false, err})
        return res.status(200).json({success: true})
    })
});

router.post("/removeFromFavourite", auth, (req, res) => {

    let variable = {}
    if (req.body.movieId) {
        variable = {movieId: req.body.movieId, userFrom: req.body.userFrom }
    } else if (req.body.serieId) {
        variable = {serieId: req.body.serieId, userFrom: req.body.userFrom }
    }

    // Favourite.findOneAndDelete({"movieId": req.body.movieId, "userFrom": req.body.userFrom})
    Favourite.findOneAndDelete(variable)
    .exec((err, doc) => {
        if(err) res.status(400).json({success: false, err})
        return res.status(200).json({success: true, doc})
    })
});

router.post("/getFavouritedMovie", auth, (req, res) => {
    let variable = {}
    if(req.body.movie) {
        variable = {'movieId': {$ne: null}, userFrom: req.body.userFrom}
    } else if (req.body.serie) {
        variable = {'serieId': {$ne: null}, userFrom: req.body.userFrom}
    }
    // if(req.body.movie) {
    //     variable = 'movieId'
    // } else if(req.body.serie) {
    //     variable = 'serieId'
    // }
    // Favourite.find({"userFrom": req.body.userFrom, variable: {$ne: null}})
    Favourite.find(variable)
    .exec((err, favourites) => {
        if(err) res.status(400).json({success: false, err})
        return res.status(200).json({success: true, favourites})
    })
});


module.exports = router;
