/**
 * @author Varun Kumar<varunon9@gmail.com>
 * https://github.com/varunon9
 * Date: 13 April, 2018
 */

const express = require('express');
const router = express.Router();

const utilityService = require('../services/utilityService');
const homeServices = require('../services/homeServices');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

const constants = require('../data/constants.js');
const middlewares = require('../middlewares');

// middleware to verify a token
router.use(middlewares.verifyToken);

router.get('/', function(req, res, next) {
	res.render('home', {
		name: req.decoded.name,
		ssid: req.decoded.ssid
	});
});

router.post('/get/userClaims', function(req, res, next) {
        const params = {
            ssid: req.decoded.ssid
        };
        homeServices.getUserClaims(params)
            .then((selfClaims) => {
                res.json({
                    success: true,
                    result: selfClaims
                });
            }).catch((err) => {
                res.json({
                    success: false,
                    message: err
                });
            });
});

router.post('/get/userClaimData', function(req, res, next) {
        const params = {
            ssid: req.decoded.ssid
        };
        homeServices.getUserClaimData(params)
            .then((selfClaims) => {
                res.json({
                    success: true,
                    result: selfClaims
                });
            }).catch((err) => {
                res.json({
                    success: false,
                    message: err
                });
            });
});

router.post('/create/selfClaim', function(req, res, next) {
    const params = {
        ssid: req.decoded.ssid
    };
    homeServices.createNewSelfClaim(params)
        .then((selfClaims) => {
            res.json({
                success: true,
                result: selfClaims
            });
        }).catch((err) => {
            res.json({
                success: false,
                message: err
            });
        });
});

router.post('/get/userServices', function(req, res, next) {
        const params = {
            ssid: req.decoded.ssid
        };
        homeServices.getUserServices(params)
            .then((selfClaims) => {
                res.json({
                    success: true,
                    result: selfClaims
                });
            }).catch((err) => {
                res.json({
                    success: false,
                    message: err
                });
            });
});

router.post('/get/userProfile', function(req, res, next) {
        const params = {
            ssid: req.decoded.ssid
        };
        homeServices.getUserProfile(params)
            .then((selfClaims) => {
                res.json({
                    success: true,
                    result: selfClaims
                });
            }).catch((err) => {
                res.json({
                    success: false,
                    message: err
                });
            });
});

router.post('/save/saveUserProfile', function(req, res, next) {
	const params = {
		email: req.body.email,
		name: req.body.name,
		ssid: req.decoded.ssid
	}
	homeServices.saveUserProfile(params)
        .then((userProfile) => {
            res.json({
                success: true,
                result: userProfile
            });
        }).catch((err) => {
            res.json({
                success: false,
                message: err
            });
        });
});

module.exports = router;