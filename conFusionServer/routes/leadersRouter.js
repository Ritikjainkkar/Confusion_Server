const express = require('express');
const bodyParser = require('body-parser');
const leadersRouter = express.Router();
var authenticate = require('../authenticate');
const cors = require('./cors');

const Leaders = require('../models/leaders');

leadersRouter.use(bodyParser.json());







leadersRouter.route('/')
.get(cors.cors, (req, res, next) => {
    Leaders.find({})
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'applicaction/json');
        res.json(leader);
    },(err) => {next(err)})
    .catch((err) => {next(err)})
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('put operation not allowed in ');
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Leaders.create(req.body)
    .then((leader) => {
        console.log("Created Leader" + leader);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'applicaction/json');
        res.json(leader);
    }, (err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Leaders.remove({})
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'applicaction/json');
        res.json(leader);
    }, (err) => {next(err)})
    .catch((err) => next(err))
});










leadersRouter.route('/:leaderId')
.get(cors.cors, (req, res, next) => {
    Leaders.findById(req.params.leaderId)
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'applicaction/json');
        res.json(leader);
    },(err) => {next(err)})
    .catch((err) => {next(err)})
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.findByIdAndUpdate(req.params.leaderId)
    .then((leader) => {
        if(req.params.description){
            leader.description = req.params.description;
        }
        leader.save()
        .then((leader) =>{
            res.statusCode = 200;
            res.setHeader('Content_Type', 'application/json');
            res.json(leader);
        }, (err) => {next(err)})
    });
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('put operation not allowed in ');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Leaders.findByIdAndRemove(req.params.leaderId)
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'applicaction/json');
        res.json(leader);
    }, (err) => {next(err)})
    .catch((err) => next(err));
});


module.exports = leadersRouter;