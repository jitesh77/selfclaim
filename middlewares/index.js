/**
 * @author Varun Kumar<varunon9@gmail.com>
 * https://github.com/varunon9
 * Date: 13 April, 2018
 */

const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

const constants = require('../data/constants.js');

module.exports = {

	verifyToken: function(req, res, next) {
		// get token from cookies
		const token = req.cookies.jwtToken;
		
		if (token) {

		    // verifies secret and checks exp
		    jwt.verify(token, config.superSecret, function(err, decoded) {      
		        if (err) {
		            //console.log(err);
		            return res.send('<p>Failed to authenticate token. Click <a href="logout">Logout</a></p>');    
		        } else {

		            // check if ssid and user type is present
		            if (!decoded.ssid || !decoded.type) {
		                res.redirect(config.baseUrl + '/login');
		            } else if (decoded.type != constants.USER.OPTIMUS) {
		                res.redirect(config.baseUrl + '/signup');
		            } else if (req.body.ssid && req.body.ssid != decoded.ssid) {
		                res.json({
		                    success: false,
		                    message: 'Invalid User'
		                });
		            } else {
		                // if everything is good, save to request for use in other routes
		                req.decoded = decoded; 
		                next();
		            }
		        }
		    });
		} else {
		    res.redirect(config.baseUrl + '/login');
		}
	},

	verifySelfClaimId: function(req, res, next) {
		// get scid from cookies
		const encryptedScid = req.cookies.selfClaimScid;

		if (req.body.selfClaimScid) {
		    jwt.verify(encryptedScid, config.superSecret, function(err, decoded) {
		        if (err) {
		            return res.json({ success: false, message: 'Failed to authenticate scid. Try refreshing page.' }); 
		        } else {
		            if (decoded.selfClaimScid != req.body.selfClaimScid) {
		                res.json({
		                    success: false,
		                    message: 'Invalid Self Claim Data'
		                });
		            } else {
		                next();
		            }
		        }
		    });
		} else {
		    next();
		}
	},

	verifyAdminToken: function(req, res, next) {
		// get token from cookies
		const token = req.cookies.jwtToken;
		
		if (token) {

		    // verifies secret and checks exp
		    jwt.verify(token, config.superSecret, function(err, decoded) {      
		        if (err) {
		            //console.log(err);
		            return res.send('<p>Failed to authenticate token. Click <a href="logout">Logout</a></p>');    
		        } else {

		            // check if id and admin type is present
		            if (!decoded.id || !decoded.type) {
		                res.redirect(config.baseUrl + '/admin/login');
		            } else if (decoded.type != constants.USER.ADMIN) {
		                res.redirect(config.baseUrl + '/admin/signup');
		            } else if (req.body.adminId && req.body.adminId != decoded.id) {
		                res.json({
		                    success: false,
		                    message: 'Invalid Admin'
		                });
		            } else {
		                // if everything is good, save to request for use in other routes
		                req.decoded = decoded; 
		                next();
		            }
		        }
		    });
		} else {
		    res.redirect(config.baseUrl + '/admin/login');
		}
	}
}