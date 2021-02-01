const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');

const favoriteRouter = express.Router();

const Favorites = require('../models/favorite');
const cors = require('./cors');

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .populate('user')
    .populate('dishes')
    .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    console.log(req.user);
    Favorites.findOne({user: req.user._id})
    .then((favorite) => {
        if(favorite){
            console.log("if");
            console.log(favorite);
            for(var i=0;i<req.body.length;i++){
                if(favorite.dishes.indexOf(req.body[i]._id) === -1){
                    favorite.dishes.push(req.body[i]._id);
                }
            }

            favorite.save()
            .then((favorite) => {
                console.log("New Favorite Created" , favorite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json')
                res.json(favorite);
            },(err) => {next(err)})
            .catch((err) => {next(err)});
        }else {
            Favorites.create({"user": req.user._id, "dishes": req.body})
            .then((favorite) => {
                console.log('Favorite Created ', favorite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));  
})
.put(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('The Operation Will never be supported')
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    Favorites.findOneAndRemove({"user": req.user._id})
    .then((favorite) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'applicaction/json');
        res.json(favorite);
    }, (err) => next(err))
    .catch((err) => next(err));
})







favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('The Operation Will never be supported on' + req.params.dishId)
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {

    Favorites.findOne({user:req.user._id})
    .then((favorite) => {
        if(favorite){
            if(favorite.dishes.indexOf(req.params.dishId) === -1){
                favorite.dishes.push(req.params.dishId);
                favorite.save()
                .then((favorite) => {
                    console.log("Your dish is added ");
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                });
            }
        }else{
            Favorites.create({"user": req.user._id, "dishes": [req.params.dishId]})
            .then((favorite) => {
                console.log('Favorite Created ', favorite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err) => next(err))
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('The Operation Will never be supported')
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorite) => {
        if (favorite) {            
            index = favorite.dishes.indexOf(req.params.dishId);
            if (index >= 0) {
                favorite.dishes.splice(index, 1);
                favorite.save()
                .then((favorite) => {
                    console.log('Favorite Deleted ', favorite);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                }, (err) => next(err));
            }
            else {
                err = new Error('Dish ' + req.params.dishId + ' not found');
                err.status = 404;
                return next(err);
            }
        }
        else {
            err = new Error('Favorites not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});


module.exports = favoriteRouter;