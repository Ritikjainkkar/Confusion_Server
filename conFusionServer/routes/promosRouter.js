const express = require('express');
const bodyParser = require('body-parser');
const promosRouter = express.Router();
var authenticate = require('../authenticate');
const cors = require('./cors');

promosRouter.use(bodyParser.json());

const Promotion = require('../models/promotions');





promosRouter.route('/')
.get(cors.cors, (req, res, next) => {
    Promotion.find({})
    .then((promo) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'applicaction/json');
        res.json(promo);
    },(err) => {next(err)})
    .catch((err) => {next(err)})
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('put operation not allowed in ');
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Promotion.create(req.body)
    .then((promo) => {
        console.log("Created Leader" + promo);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'applicaction/json');
        res.json(promo);
    }, (err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Promotion.remove({})
    .then((promo) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'applicaction/json');
        res.json(promo);
    }, (err) => {next(err)})
    .catch((err) => next(err))
});










promosRouter.route('/:promoId')
.get(cors.cors, (req, res, next) => {
    Promotion.findById(req.params.promoId)
    .then((promo) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'applicaction/json');
        res.json(promo);
    },(err) => {next(err)})
    .catch((err) => {next(err)})
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.findByIdAndUpdate(req.params.promoId)
    .then((promo) => {
        if(req.params.description){
            promo.description = req.params.description;
        }
        promo.save()
        .then((promo) =>{
            res.statusCode = 200;
            res.setHeader('Content_Type', 'application/json');
            res.json(promo);
        }, (err) => {next(err)})
    });
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('put operation not allowed in ');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotion.findByIdAndRemove(req.params.promoId)
    .then((promo) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'applicaction/json');
        res.json(promo);
    }, (err) => {next(err)})
    .catch((err) => next(err));
});


module.exports = promosRouter;