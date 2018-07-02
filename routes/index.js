const express = require('express');
const router = express.Router();

const utilityService = require('../services/utilityService');
const userService = require('../services/userService');
const adminService = require('../services/adminService');
const validationService = require('../services/validationService');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

/* GET home page. */
router.get('/', function(req, res, next) {
    res.redirect(config.baseUrl + '/dashboard');
});

router.get('/login', function(req, res, next) {
    res.render('login', {});
});

router.get('/admin/login', function(req, res, next) {
    res.render('admin/login', {});
});

router.get('/signup', function(req, res, next) {
    res.render('signup', {});
});

router.get('/calculator', function(req, res, next) {
    res.render('calculator', {});
});

/**
 * Send Otp only to registered users
 */
router.post('/user/send/otp', function(req, res, next) {
	const params = req.body;

	// check if such user exist
	validationService.doesSuchUserExist(params.mobile)
	    .then(result => {
	    	if (result) {
	    		// send otp
	    		params.otpKey = params.mobile + config.otpKeys.USER;
	    		utilityService.sendOTP(params, function failure(errorMessage) {
	    			console.log('Send OTP Error: ' + errorMessage);
	    			res.json({
	    				success: false,
	    				message: 'Unable to Send OTP'
	    			});
	    		}, function success(message) {
	    			res.json({
	    				success: true,
	    				message: 'OTP sent'
	    			});
	    		});
	    	} else {
	    		res.json({
	    			success: false,
	    			message: 'No such User Exist'
	    		});
	    	}
	    }).catch(err => {
	    	console.log(err);
	    	res.json({
	    		success: false,
	    		message: 'Server side validation error :('
	    	});
	    });
    
});

/**
 * Send Otp only to admins
 */
router.post('/admin/send/otp', function(req, res, next) {
	const params = req.body;

	// check if such admin exist
	validationService.doesSuchAdminExist(params.mobile)
	    .then(result => {
	    	if (result) {
	    		// send otp
	    		params.otpKey = params.mobile + config.otpKeys.ADMIN;
	    		utilityService.sendOTP(params, function failure(errorMessage) {
	    			console.log('Send OTP Error: ' + errorMessage);
	    			res.json({
	    				success: false,
	    				message: 'Unable to Send OTP'
	    			});
	    		}, function success(message) {
	    			res.json({
	    				success: true,
	    				message: 'OTP sent'
	    			});
	    		});
	    	} else {
	    		res.json({
	    			success: false,
	    			message: 'No such Admin Exist'
	    		});
	    	}
	    }).catch(err => {
	    	console.log(err);
	    	res.json({
	    		success: false,
	    		message: 'Server side validation error :('
	    	});
	    });
    
});

/**
 * Send Otp for signup/authentication purpose
 * This is a generic API
 */
router.post('/send/otp', function(req, res, next) {
	const params = req.body;

	// send otp
	params.otpKey = params.mobile + config.otpKeys.NEW_USER;
	utilityService.sendOTP(params, function failure(errorMessage) {
		console.log('Send OTP Error: ' + errorMessage);
		res.json({
			success: false,
			message: 'Unable to Send OTP'
		});
	}, function success(message) {
		res.json({
			success: true,
			message: 'OTP sent'
		});
	});
    
});

/**
 * Verify Otp only for registered users
 */
router.post('/user/verify/otp', function(req, res, next) {
	const params = req.body;
	params.otpKey = params.mobile + config.otpKeys.USER;

	utilityService.verifyOTP(params, function failureCallback(errorMessage) {
		res.json({
			success: false,
			message: 'OTP Mismatch'
		});
	}, function successCallback(otp) {
		userService.getUser(params)
		    .then(user => {
		    	user.keepMeLoggedIn = params.keepMeLoggedIn;
				const token = utilityService.getToken(user);
				let maxAge = 2 * 60 * 60 * 1000; // maxAge: 2 hours
		        if (params.keepMeLoggedIn) {
		        	maxAge = 7 * 24 * 60 * 60 * 1000; // maxAge: 7 days
		        }

	            res.cookie('jwtToken', token, { maxAge: maxAge, httpOnly: true }); 
	    	    res.json({
	    	    	success: true,
	    	    	message: 'Mobile Number Verified'
	    	    });
		    }).catch(err => {
		    	res.json({
		    		success: false,
		    		message: err
		    	});
		    });
	});
    
});

/**
 * Verify Otp only for admins defined in system
 */
router.post('/admin/verify/otp', function(req, res, next) {
	const params = req.body;
	params.otpKey = params.mobile + config.otpKeys.ADMIN;

	utilityService.verifyOTP(params, function failureCallback(errorMessage) {
		res.json({
			success: false,
			message: 'OTP Mismatch'
		});
	}, function successCallback(otp) {
		adminService.getAdmin(params)
		    .then(admin => {
				const token = utilityService.getAdminToken(admin);
				let maxAge = 2 * 60 * 60 * 1000; // maxAge: 2 hours

	            res.cookie('jwtToken', token, { maxAge: maxAge, httpOnly: true }); 
	    	    res.json({
	    	    	success: true,
	    	    	message: 'Mobile Number Verified'
	    	    });
		    }).catch(err => {
		    	res.json({
		    		success: false,
		    		message: err
		    	});
		    });
	});
    
});

/**
 * Verify Otp for new users, This is a generic API
 */
router.post('/verify/otp', function(req, res, next) {
	const params = req.body;
	params.otpKey = params.mobile + config.otpKeys.NEW_USER;

	utilityService.verifyOTP(params, function failureCallback(errorMessage) {
		res.json({
			success: false,
			message: 'OTP Mismatch'
		});
	}, function successCallback(otp) {
		res.json({
			success: true,
			message: 'OTP Verified'
		});
	});
    
});

/**
 * This API will be consumed on sureclaim.in wordpress website
 * It will verify otp and trigger a mail to sureclaim admin
 * It will also save user to master users table of selfclaim app
 */
router.post('/service/signup', function(req, res, next) {
	const params = req.body;
	params.otpKey = params.mobile + config.otpKeys.NEW_USER;

	utilityService.verifyOTP(params, function failureCallback(errorMessage) {
		res.json({
			success: false,
			message: 'OTP Mismatch'
		});
	}, function successCallback(otp) {
		res.json({
			success: true,
			message: 'OTP Verified'
		});

		// trigger mail to sureclaim admin
		utilityService.sendServiceSignupMailToAdmin(params);
	});
    
});

router.post('/signup', function(req, res, next) {
	const params = req.body;
	if (params.otp) {
		params.otpKey = params.mobile + config.otpKeys.NEW_USER;

		utilityService.verifyOTP(params, function failureCallback(errorMessage) {
			res.json({
				success: false,
				message: 'OTP Mismatch'
			});
		}, function successCallback(otp) {
			userService.signup(params).then(user => {
				const token = utilityService.getToken(user);
		        res.cookie('jwtToken', token, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true }); // maxAge: 2 hours
				res.json({
					success: true
				});
				/*// sending welcome mail
				utilityService.sendWelcomeMail(user);

				// sending Welcome Message
				utilityService.sendWelcomeMessage(user);*/
			}).catch(err => {
				res.json({
					success: false,
					message: err
				});
			});
		});
	} else {
		res.json({
			success: false,
			message: 'OTP Required'
		});
	}
    
});

router.post('/get/insurers', function(req, res, next) {
    const params = req.body;
    userService.getInsurers(params)
        .then(insurers => {
        	res.json({
        	    success: true,
        	    result: insurers
        	});
        }).catch(err => {
        	res.json({
        	    success: false,
        	    message: err
        	});
        });
});

router.post('/get/tpas', function(req, res, next) {
    const params = req.body;
    userService.getTpas(params)
        .then(tpas => {
        	res.json({
        	    success: true,
        	    result: tpas
        	});
        }).catch(err => {
        	res.json({
        	    success: false,
        	    message: err
        	});
        });
});

router.get('/logout', function(req, res, next) {
	res.clearCookie('jwtToken');
	res.redirect(config.baseUrl + '/');
});

router.post('/add/claimCalculatorUser', function(req, res, next) {
    const param = req.body;
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const params = {};
    params.dateOfAdmission = param.dateOfAdmission;
    params.dateOfDischarge = param.dateOfDischarge;
    params.ipAddress = ip;
    userService.addClaimCalculatorUser(params)
        .then(data => {
        	res.json({
        	    success: true,
        	    result: data
        	});
        }).catch(err => {
        	res.json({
        	    success: false,
        	    message: err
        	});
        });
});

router.post('/add/claimCalculatorBill', function(req, res, next) {
    const params = req.body;
    userService.addClaimCalculatorBill(params)
        .then(data => {
        	res.json({
        	    success: true,
        	    result: data
        	});
        }).catch(err => {
        	res.json({
        	    success: false,
        	    message: err
        	});
        });
});

router.post('/update/claimCalculatorBill', function(req, res, next) {
    const params = req.body;
    userService.updateClaimCalculatorBill(params)
        .then(data => {
        	res.json({
        	    success: true,
        	    result: data
        	});
        }).catch(err => {
        	res.json({
        	    success: false,
        	    message: err
        	});
        });
});

router.post('/delete/claimCalculatorBill', function(req, res, next) {
    const params = req.body;
    userService.deleteClaimCalculatorBill(params)
        .then(data => {
        	res.json({
        	    success: true,
        	    result: data
        	});
        }).catch(err => {
        	res.json({
        	    success: false,
        	    message: err
        	});
        });
});

router.post('/show/claimCalculatorBills', function(req, res, next) {
    const params = req.body;
    userService.showClaimCalculatorBills(params)
        .then(data => {
        	res.json({
        	    success: true,
        	    result: data
        	});
        }).catch(err => {
        	res.json({
        	    success: false,
        	    message: err
        	});
        });
});

module.exports = router;