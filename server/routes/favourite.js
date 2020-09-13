const express = require('express');
const router = express.Router();
const { Favourite } = require("../models/Favourite");

const { auth } = require("../middleware/auth");

//=================================
//             Favourite
//=================================


router.post("/favouriteNumber", auth, (req, res) => {
    
    Favourite.find({"movieId": req.body.movieId})
        .exec((err, favourite) => {
            if(err) {
                return res.status(400).send(err)
            }
            res.status(200).json({success: true, favouriteNumber: favourite.length})
        })
});

router.post("/favourited", auth, (req, res) => {
    Favourite.find({"movieId": req.body.movieId, "userFrom": req.body.userFrom })
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

    Favourite.findOneAndDelete({"movieId": req.body.movieId, "userFrom": req.body.userFrom})
    .exec((err, doc) => {
        if(err) res.status(400).json({success: false, err})
        return res.status(200).json({success: true, doc})
    })
});

router.post("/getFavouritedMovie", auth, (req, res) => {

    Favourite.find({"userFrom": req.body.userFrom})
    .exec((err, favourites) => {
        if(err) res.status(400).json({success: false, err})
        return res.status(200).json({success: true, favourites})
    })
});


module.exports = router;
