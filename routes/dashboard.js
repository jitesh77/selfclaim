const express = require('express');
const router = express.Router();

const utilityService = require('../services/utilityService');
const userService = require('../services/userService');
const validationService = require('../services/validationService');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

const constants = require('../data/constants.js');
const middlewares = require('../middlewares');

// insurer-tpa form mapping logic
const insurerTpaFormMappingLogic = require('../modules/insurerTpaFormMapping');

// middleware to verify a token
router.use(middlewares.verifyToken);

// middleware to verify self-claim id
router.use(middlewares.verifySelfClaimId);

// middleware to make blank parameters fields null
// params must be object
router.use('/save', function(req, res, next) {
    const params = req.body;
    try {
        Object.keys(params).forEach(function(key) {
            if (params[key] == '') {
                params[key] = null;
            }
        });
    } catch (e) {
        console.log('Exception at save middleware', e);
    }

    next();
});


router.get('/', function(req, res, next) {
    userService.getLatestClaimHospitalInfo(req.decoded)
        .then(hospitalInfo => {

            userService.getInsurers({})
                .then(insurers => {
                    
                    userService.getTpas({})
                        .then(tpas => {
                            
                            userService.getStates({})
                                .then(states => {
                                    
                                    res.render('dashboard', {
                                        mobile: req.decoded.mobile,
                                        ssid: req.decoded.ssid,
                                        scid: -1,
                                        name: req.decoded.name,
                                        admissionDate: hospitalInfo.dateOfAdmission,
                                        insurers: insurers,
                                        tpas: tpas,
                                        states: states
                                    });

                                }).catch(err => {
                                    res.render('dashboard', {
                                        mobile: req.decoded.mobile,
                                        ssid: req.decoded.ssid,
                                        scid: -1,
                                        name: req.decoded.name,
                                        admissionDate: hospitalInfo.dateOfAdmission,
                                        insurers: insurers,
                                        tpas: tpas,
                                        states: []
                                    });
                                });
                        }).catch(err => {
                            res.render('dashboard', {
                                mobile: req.decoded.mobile,
                                ssid: req.decoded.ssid,
                                scid: -1,
                                name: req.decoded.name,
                                admissionDate: hospitalInfo.dateOfAdmission,
                                insurers: insurers,
                                tpas: [],
                                states: []
                            });
                        });
                }).catch(err => {
                    res.render('dashboard', {
                        mobile: req.decoded.mobile,
                        ssid: req.decoded.ssid,
                        scid: -1,
                        name: req.decoded.name,
                        admissionDate: hospitalInfo.dateOfAdmission,
                        insurers: [],
                        tpas: [],
                        states: []
                    });
                });

        }).catch(err => {
            res.render('dashboard', {
                mobile: req.decoded.mobile,
                ssid: req.decoded.ssid,
                scid: -1,
                name: req.decoded.name,
                admissionDate: '',
                insurers: [],
                tpas: [],
                states: []
            });
        });
});

router.get('/myclaim/:scid', function(req, res, next) {
    const params = {};
    params.scid = atob(req.params.scid);
    params.ssid = req.decoded.ssid;

    validationService.doesSelfClaimBelongsToUser(params)
        .then(result => {
            if (result) {
                userService.getSelfClaimHospitalInfo(params)
                    .then(hospitalInfo => {

                        userService.getInsurers({})
                            .then(insurers => {
                                
                                userService.getTpas({})
                                    .then(tpas => {
                                        
                                        userService.getStates({})
                                            .then(states => {
                                                
                                                res.render('dashboard', {
                                                    mobile: req.decoded.mobile,
                                                    ssid: req.decoded.ssid,
                                                    scid: params.scid,
                                                    name: req.decoded.name,
                                                    admissionDate: hospitalInfo.dateOfAdmission,
                                                    insurers: insurers,
                                                    tpas: tpas,
                                                    states: states
                                                });

                                            }).catch(err => {
                                                res.render('dashboard', {
                                                    mobile: req.decoded.mobile,
                                                    ssid: req.decoded.ssid,
                                                    scid: params.scid,
                                                    name: req.decoded.name,
                                                    admissionDate: hospitalInfo.dateOfAdmission,
                                                    insurers: insurers,
                                                    tpas: tpas,
                                                    states: []
                                                });
                                            });
                                    }).catch(err => {
                                        res.render('dashboard', {
                                            mobile: req.decoded.mobile,
                                            ssid: req.decoded.ssid,
                                            scid: params.scid,
                                            name: req.decoded.name,
                                            admissionDate: hospitalInfo.dateOfAdmission,
                                            insurers: insurers,
                                            tpas: [],
                                            states: []
                                        });
                                    });
                            }).catch(err => {
                                res.render('dashboard', {
                                    mobile: req.decoded.mobile,
                                    ssid: req.decoded.ssid,
                                    scid: params.scid,
                                    name: req.decoded.name,
                                    admissionDate: hospitalInfo.dateOfAdmission,
                                    insurers: [],
                                    tpas: [],
                                    states: []
                                });
                            });

                    }).catch(err => {
                        res.render('dashboard', {
                            mobile: req.decoded.mobile,
                            ssid: req.decoded.ssid,
                            scid: params.scid,
                            name: req.decoded.name,
                            admissionDate: '',
                            insurers: [],
                            tpas: [],
                            states: []
                        });
                    });
            } else {
                res.redirect(config.baseUrl + '/dashboard');
            }
        }).catch((err) => {
            console.log('Error occured at doesSelfClaimBelongsToUser', err);
            res.json({
                success: false,
                message: 'Server side error'
            });
        });
});

router.get('/welcome', function(req, res, next) {
    res.render('welcome');
});

router.get('/', function(req, res, next) {
    res.render('home');
});

router.get('/claim-preview', function(req, res, next) {
    res.render('claim-preview');
});

router.get('/finalize-claim', function(req, res, next) {
    res.render('finalize-claim');
});

router.get('/download-pdf', function(req, res, next) {
    let formName = 
             insurerTpaFormMappingLogic(req.query.insurerId, req.query.tpaId);
    formName = 'claim-forms/' + formName;
    res.render(formName);
});

router.post('/get/latestSelfClaim', function(req, res, next) {
    const params = {};
    params.ssid = req.decoded.ssid;
    
    userService.getLatestSelfClaim(params)
        .then(selfClaim => {
            // sending only active bills
            var bills = [];
            selfClaim.bills.forEach(function(bill) {
                if (bill.isActive) {
                    bills.push(bill);
                }
            });
            selfClaim.bills = bills;

            // sending only active receipts
            var receipts = [];
            selfClaim.receipts.forEach(function(receipt) {
                if (receipt.isActive) {
                    receipts.push(receipt);
                }
            });
            selfClaim.receipts = receipts;

            // to authenticate save APIs related to self claim
            const encryptedScid = utilityService.getEncryptedScid(selfClaim.scid);
            res.cookie('selfClaimScid', encryptedScid, { 
                maxAge: 2 * 60 * 60 * 1000, httpOnly: true 
            }); // maxAge: 2 hours

            res.json({
                success: true,
                result: selfClaim
            });
        }).catch(err => {
            res.json({
                success: false,
                message: err
            });
        });
});

router.post('/get/selfClaim/:scid', function(req, res, next) {
    const params = {};
    params.scid = req.params.scid;
    params.ssid = req.decoded.ssid;
    
    userService.getSelfClaim(params)
        .then(selfClaim => {
            // sending only active bills
            var bills = [];
            selfClaim.bills.forEach(function(bill) {
                if (bill.isActive) {
                    bills.push(bill);
                }
            });
            selfClaim.bills = bills;

            // sending only active receipts
            var receipts = [];
            selfClaim.receipts.forEach(function(receipt) {
                if (receipt.isActive) {
                    receipts.push(receipt);
                }
            });
            selfClaim.receipts = receipts;

            // to authenticate save APIs related to self claim
            const encryptedScid = utilityService.getEncryptedScid(selfClaim.scid);
            res.cookie('selfClaimScid', encryptedScid, { 
                maxAge: 2 * 60 * 60 * 1000, httpOnly: true 
            }); // maxAge: 2 hours

            res.json({
                success: true,
                result: selfClaim
            });
        }).catch(err => {
            res.json({
                success: false,
                message: err
            });
        });
});

router.post('/save/selfClaim', function(req, res, next) {
    const params = req.body;

    userService.saveSelfClaim(params)
        .then(selfClaim => {
            res.json({
                success: true,
                result: selfClaim
            });
        }).catch(err => {
            res.json({
                success: false,
                message: err
            });
        });
});

router.post('/save/user', function(req, res, next) {
    const params = req.body;
    
    userService.saveUser(params)
        .then(user => {
            res.json({
                success: true,
                result: user
            });
        }).catch(err => {
            res.json({
                success: false,
                message: err
            });
        });
});

router.post('/save/patient', function(req, res, next) {
    const params = req.body;
    
    userService.savePatient(params)
        .then(patient => {
            res.json({
                success: true,
                result: patient
            });
        }).catch(err => {
            res.json({
                success: false,
                message: err
            });
        });
});

router.post('/save/policyHolder', function(req, res, next) {
    const params = req.body;
    
    userService.savePolicyHolder(params)
        .then(policyHolder => {
            res.json({
                success: true,
                result: policyHolder
            });
        }).catch(err => {
            res.json({
                success: false,
                message: err
            });
        });
});

router.post('/save/insuranceInfo', function(req, res, next) {
    const params = req.body;

    // validating insurerId and tpaId to be integer
    if (params.insurerId) {
        if (utilityService.isInt(params.insurerId)) {
        } else {
            res.json({
                success: false,
                message: 'insurer Id is incorrect. Please choose correct insurer name from dropdown.'
            });
            return;
        }
    }

    if (params.tpaId) {
        if (params.tpaId == 'NA') {
            params.tpaId = null;
            params.tpaCustomerId = null;
        } else if (utilityService.isInt(params.tpaId)) {
        } else {
            res.json({
                success: false,
                message: 'tpa Id is incorrect. Please choose correct tpa name from dropdown.'
            });
            return;
        }
    }

    userService.saveInsuranceInfo(params)
        .then(insuranceInfo => {
            res.json({
                success: true,
                result: insuranceInfo
            });
        }).catch(err => {
            res.json({
                success: false,
                message: err
            });
        });
});

router.post('/save/treatmentInfo', function(req, res, next) {
    const params = req.body;
    
    userService.saveTreatmentInfo(params)
        .then(treatmentInfo => {
            res.json({
                success: true,
                result: treatmentInfo
            });
        }).catch(err => {
            res.json({
                success: false,
                message: err
            });
        });
});

router.post('/createOrUpdate/bill', function(req, res, next) {
    const params = req.body;

    if (params.date == '') {
        delete params.date;
    }
    if (params.amount == '') {
        delete params.amount;
    }
    if (params.number == '') {
        delete params.number;
    }

    if (params.id) {
        userService.updateBill(params)
            .then(bill => {
                res.json({
                    success: true,
                    result: bill
                });
            }).catch(err => {
                res.json({
                    success: false,
                    message: err
                });
            });
    } else {
        userService.createBill(params)
            .then(bill => {
                res.json({
                    success: true,
                    result: bill
                });
            }).catch(err => {
                res.json({
                    success: false,
                    message: err
                });
            });
    }
});

router.post('/delete/bill', function(req, res, next) {
    const params = {};

    params.id = req.body.id;
    params.selfClaimScid = req.body.selfClaimScid;
    params.isActive = false;

    userService.getBills(params)
        .then(bills => {
            if (bills.length > 1) {
                userService.updateBill(params)
                    .then(bill => {
                        res.json({
                            success: true
                        });
                    }).catch(err => {
                        res.json({
                            success: false,
                            message: err
                        });
                    });
            } else {
                res.json({
                    success: false,
                    message: 'At least one bill must exist.'
                });
            }
        }).catch(err => {
            res.json({
                success: false,
                message: err
            });
        });
});

router.post('/get/bills', function(req, res, next) {
    const params = req.body;
    
    userService.getBills(params)
        .then(bills => {
            res.json({
                success: true,
                result: bills
            });
        }).catch(err => {
            res.json({
                success: false,
                message: err
            });
        });
});

router.post('/create/address', function(req, res, next) {
    const params = req.body;
    if (params.pin == '') {
        delete params.pin;
    }

    userService.createAddress(params)
        .then(address => {
            res.json({
                success: true,
                result: address
            });
        }).catch(err => {
            res.json({
                success: false,
                message: err
            });
        });
});

router.post('/update/address', function(req, res, next) {
    const params = req.body;
    if (params.pin == '') {
        delete params.pin;
    }

    userService.updateAddress(params)
        .then(address => {
            res.json({
                success: true,
                result: address
            });
        }).catch(err => {
            res.json({
                success: false,
                message: err
            });
        });
});

router.post('/save/hospitalInfo', function(req, res, next) {
    const params = req.body;
    
    userService.saveHospitalInfo(params)
        .then(hospitalInfo => {
            res.json({
                success: true,
                result: hospitalInfo
            });
        }).catch(err => {
            res.json({
                success: false,
                message: err
            });
        });
});

router.post('/save/communicationInfo', function(req, res, next) {
    const params = req.body;

    userService.saveCommunicationInfo(params)
        .then(communicationInfo => {
            res.json({
                success: true,
                result: communicationInfo
            });
        }).catch(err => {
            res.json({
                success: false,
                message: err
            });
        });
});

router.post('/createOrUpdate/receipt', function(req, res, next) {
    const params = req.body;

    if (params.date == '') {
        delete params.date;
    }
    if (params.amount == '') {
        delete params.amount;
    }
    if (params.number == '') {
        delete params.number;
    }

    if (params.id) {
        userService.updateReceipt(params)
            .then(receipt => {
                res.json({
                    success: true,
                    result: receipt
                });
            }).catch(err => {
                res.json({
                    success: false,
                    message: err
                });
            });
    } else {
        userService.createReceipt(params)
            .then(receipt => {
                res.json({
                    success: true,
                    result: receipt
                });
            }).catch(err => {
                res.json({
                    success: false,
                    message: err
                });
            });
    }
});

router.post('/delete/receipt', function(req, res, next) {
    const params = {};
    
    params.id = req.body.id;
    params.selfClaimScid = req.body.selfClaimScid;
    params.isActive = false;

    userService.getReceipts(params)
        .then(receipts => {
            if (receipts.length > 1) {
                userService.updateReceipt(params)
                    .then(receipt => {
                        res.json({
                            success: true
                        });
                    }).catch(err => {
                        res.json({
                            success: false,
                            message: err
                        });
                    });
            } else {
                res.json({
                    success: false,
                    message: 'At least one receipt must exist.'
                });
            }
        }).catch(err => {
            res.json({
                success: false,
                message: err
            });
        });
});

router.post('/get/receipts', function(req, res, next) {
    const params = req.body;
    
    userService.getReceipts(params)
        .then(receipts => {
            res.json({
                success: true,
                result: receipts
            });
        }).catch(err => {
            res.json({
                success: false,
                message: err
            });
        });
});

module.exports = router;