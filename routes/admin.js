/**
 * @author Varun Kumar<varunon9@gmail.com>
 * https://github.com/varunon9
 * Date: 18 April, 2018
 */

const express = require('express');
const router = express.Router();

const utilityService = require('../services/utilityService');
const adminService = require('../services/adminService');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

const constants = require('../data/constants.js');
const middlewares = require('../middlewares');
global.atob = require("atob");

// middleware to verify a token
router.use(middlewares.verifyAdminToken);

router.get('/', function(req, res, next) {
    res.render('admin/dashboard', {
        name: req.decoded.name
    });
});

router.get('/proforma', function(req, res, next) {
    res.render('admin/proforma', {
        name: req.decoded.name
    });
});

router.get('/new-user', function(req, res, next) {
    res.render('admin/new-user', {
        name: req.decoded.name
    });
});

router.get('/invoice', function(req, res, next) {
    res.render('admin/invoice', {
    });
});

router.post('/get/profile', function(req, res, next) {
    const params = req.decoded;
    adminService.getAdmin(params)
        .then((admin) => {
            res.json({
                success: true,
                result: admin
            });
        }).catch((err) => {
            res.json({
                success: false,
                message: err
            });
        });
});


router.post('/get/users', function(req, res, next) {
    const type = req.decoded.type;
    if (type == constants.USER.ADMIN) {

        const params = req.body;
        adminService.getUsers(params, function failureCallback(errorMessage) {
            res.json({
                success: false,
                message: errorMessage
            });
        }, function successCallback(users) {
            res.json({
                success: true,
                result: users
            });
        });
    } else {
        res.json({
            success: false,
            message: 'Not Authorized'
        });
    }
});

router.post('/get/admins', function(req, res, next) {
    const type = req.decoded.type;
    if (type == constants.USER.ADMIN) {

        const params = req.body;
        adminService.getAdmins(params, function failureCallback(errorMessage) {
            res.json({
                success: false,
                message: errorMessage
            });
        }, function successCallback(admins) {
            res.json({
                success: true,
                result: admins
            });
        });
    } else {
        res.json({
            success: false,
            message: 'Not Authorized'
        });
    }
});

router.post('/add/service', function(req, res, next) {
    const type = req.decoded.type;
    if (type == constants.USER.ADMIN) {
        const params = req.body;
        adminService.addNewService(params)
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
    } else {
        res.json({
            success: false,
            message: 'Not Authorized'
        });
    }
});

router.post('/get/services', function(req, res, next) {
    const type = req.decoded.type;
    if (type == constants.USER.ADMIN) {
        const params = req.body;
        adminService.getAdminServices(params)
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
    } else {
        res.json({
            success: false,
            message: 'Not Authorized'
        });
    }
});

router.post('/get/allProformas', function(req, res, next) {
    const type = req.decoded.type;
    if (type == constants.USER.ADMIN) {
        const params = req.body;
        adminService.getAllProformas(params)
            .then((data) => {
                res.json({
                    success: true,
                    result: data
                });
            }).catch((err) => {
                res.json({
                    success: false,
                    message: err
                });
            });
    } else {
        res.json({
            success: false,
            message: 'Not Authorized'
        });
    }
});

router.post('/delete/proforma', function(req, res, next) {
    const type = req.decoded.type;
    if (type == constants.USER.ADMIN) {
        const params = req.body;
        adminService.deleteProforma(params)
            .then((data) => {
                res.json({
                    success: true,
                    result: data
                });
            }).catch((err) => {
                res.json({
                    success: false,
                    message: err
                });
            });
    } else {
        res.json({
            success: false,
            message: 'Not Authorized'
        });
    }
});

router.post('/search/proformaDateWise', function(req, res, next) {
    const type = req.decoded.type;
    if (type == constants.USER.ADMIN) {
        const params = req.body;
        adminService.searchProformaDateWise(params)
            .then((data) => {
                res.json({
                    success: true,
                    result: data
                });
            }).catch((err) => {
                res.json({
                    success: false,
                    message: err
                });
            });
    } else {
        res.json({
            success: false,
            message: 'Not Authorized'
        });
    }
});

router.post('/search/proformaByMobile', function(req, res, next) {
    const type = req.decoded.type;
    if (type == constants.USER.ADMIN) {
        const params = req.body;
        adminService.searchProformaByMobile(params)
            .then((data) => {
                res.json({
                    success: true,
                    result: data
                });
            }).catch((err) => {
                res.json({
                    success: false,
                    message: err
                });
            });
    } else {
        res.json({
            success: false,
            message: 'Not Authorized'
        });
    }
});

router.post('/search/proformaByPatient', function(req, res, next) {
    const type = req.decoded.type;
    if (type == constants.USER.ADMIN) {
        const params = req.body;
        adminService.searchProformaByPatient(params)
            .then((data) => {
                res.json({
                    success: true,
                    result: data
                });
            }).catch((err) => {
                res.json({
                    success: false,
                    message: err
                });
            });
    } else {
        res.json({
            success: false,
            message: 'Not Authorized'
        });
    }
});

router.post('/delete/service', function(req, res, next) {
    const type = req.decoded.type;
    if (type == constants.USER.ADMIN) {
        const params = req.body;
        adminService.deleteService(params)
            .then((data) => {
                res.json({
                    success: true,
                    result: data
                });
            }).catch((err) => {
                res.json({
                    success: false,
                    message: err
                });
            });
    } else {
        res.json({
            success: false,
            message: 'Not Authorized'
        });
    }
});

router.get('/proforma-edit/:id', (req, res, next) => {
    const type = req.decoded.type;
    if (type == constants.USER.ADMIN) {
        const newId = atob(req.params.id);
        const params = {
            id: newId
        };        
        adminService.getProformaData(params)
            .then((data) => {
                res.render('admin/proforma-edit', {
                    name: req.decoded.name,
                    proformaData: data
                });
            }).catch((err) => {
                res.json({
                    success: false,
                    message: err
                });
            });
    } else {
        res.json({
            success: false,
            message: 'Not Authorized'
        });
    }
});

router.get('/invoice/:id', (req, res, next) => {
    const type = req.decoded.type;
    if (type == constants.USER.ADMIN) {
        const proformaId = atob(req.params.id);
        const params = {
            id: proformaId
        };
        adminService.getProformaData(params)
            .then((data) => {
                res.render('admin/invoice', {
                    name: req.decoded.name,
                    invoiceData: data
                });
            }).catch((err) => {
                res.json({
                    success: false,
                    message: err
                });
            });
    } else {
        res.json({
            success: false,
            message: 'Not Authorized'
        });
    }
});

router.post('/get/selfClaims', function(req, res, next) {
    const type = req.decoded.type;
    if (type == constants.USER.ADMIN) {
        const params = req.body;
        adminService.getSelfClaims(params)
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
    } else {
        res.json({
            success: false,
            message: 'Not Authorized'
        });
    }
});

router.get('/selfClaim/form/:scid', (req, res, next) => {
    const type = req.decoded.type;
    if (type == constants.USER.ADMIN) {
        const params = {
            scid: req.params.scid
        };
        
        adminService.getSelfClaimData(params)
            .then((selfClaim) => {
                res.render('admin/selfClaim-form', {
                    selfClaim: selfClaim
                });
            }).catch((err) => {
                res.json({
                    success: false,
                    message: err
                });
            });
    } else {
        res.json({
            success: false,
            message: 'Not Authorized'
        });
    }
});

router.get('/selfClaim/download-data/:scid', (req, res, next) => {
    const type = req.decoded.type;
    if (type == constants.USER.ADMIN) {
        const params = {
            scid: req.params.scid
        };
        
        adminService.getSelfClaimData(params)
            .then((selfClaim) => {
                res.render('admin/download-data', {
                    selfClaim: selfClaim
                });
            }).catch((err) => {
                res.json({
                    success: false,
                    message: err
                });
            });
    } else {
        res.json({
            success: false,
            message: 'Not Authorized'
        });
    }
});

router.post('/get/allServices', (req, res, next) => {
    const type = req.decoded.type;
    if (type == constants.USER.ADMIN) {
        adminService.getAllServices()
            .then((selfClaim) => {
                res.json({
                    success: true,
                    result: selfClaim
                });
            }).catch((err) => {
                res.json({
                    success: false,
                    message: err
                });
            });
    } else {
        res.json({
            success: false,
            message: 'Not Authorized'
        });
    }
});

router.post('/search/proformaUser', (req, res, next) => {
    const type = req.decoded.type;
    if (type == constants.USER.ADMIN) {
        const params = req.body;
        adminService.searchProformaUser(params)
            .then((selfClaim) => {
                res.json({
                    success: true,
                    result: selfClaim
                });
            }).catch((err) => {
                res.json({
                    success: false,
                    message: err
                });
            });
    } else {
        res.json({
            success: false,
            message: 'Not Authorized'
        });
    }
});

router.post('/add/user', (req, res, next) => {
    const type = req.decoded.type;
    if (type == constants.USER.ADMIN) {
        const params = req.body;
        adminService.addUser(params)
            .then((selfClaim) => {
                res.json({
                    success: true,
                    result: selfClaim
                });
            }).catch((err) => {
                res.json({
                    success: false,
                    message: err
                });
            });
    } else {
        res.json({
            success: false,
            message: 'Not Authorized'
        });
    }
});

router.post('/get/userSsid', (req, res, next) => {
    const type = req.decoded.type;
    if (type == constants.USER.ADMIN) {
        const params = req.body;
        adminService.getUserSsid(params)
            .then((userId) => {
                res.json({
                    success: true,
                    result: userId
                });
            }).catch((err) => {
                res.json({
                    success: false,
                    message: err
                });
            });
    } else {
        res.json({
            success: false,
            message: 'Not Authorized'
        });
    }
});

router.post('/create/proforma', (req, res, next) => {
    const type = req.decoded.type;
    if (type == constants.USER.ADMIN) {
        const params = req.body;
        adminService.createNewProforma(params)
            .then((userId) => {
                res.json({
                    success: true,
                    result: userId
                });
            }).catch((err) => {
                res.json({
                    success: false,
                    message: err
                });
            });
    } else {
        res.json({
            success: false,
            message: 'Not Authorized'
        });
    }
});

router.post('/add/proformaService', (req, res, next) => {
    const type = req.decoded.type;
    if (type == constants.USER.ADMIN) {
        const param = req.body;
        const adminId = req.decoded.id;
        const params = {};
        params.admin = adminId;
        params.service = param.serviceId;
        params.proforma = param.proformaId;
        params.price = param.servicePrice;
        params.qty = param.serviceQty;

        adminService.addProformaService(params)
            .then((service) => {
                res.json({
                    success: true,
                    result: service
                });
            }).catch((err) => {
                res.json({
                    success: false,
                    message: err
                });
            });
    } else {
        res.json({
            success: false,
            message: 'Not Authorized'
        });
    }
});

router.post('/check/proformaService', (req, res, next) => {
    const type = req.decoded.type;
    if (type == constants.USER.ADMIN) {
        const params = req.body;
        adminService.displayProformaService(params)
            .then((service) => {
                res.json({
                    success: true,
                    result: service
                });
            }).catch((err) => {
                res.json({
                    success: false,
                    message: err
                });
            });
    } else {
        res.json({
            success: false,
            message: 'Not Authorized'
        });
    }
});

router.post('/display/proformaService', (req, res, next) => {
    const type = req.decoded.type;
    if (type == constants.USER.ADMIN) {
        const params = req.body;
        adminService.displayProformaService(params)
            .then((service) => {
                res.json({
                    success: true,
                    result: service
                });
            }).catch((err) => {
                res.json({
                    success: false,
                    message: err
                });
            });
    } else {
        res.json({
            success: false,
            message: 'Not Authorized'
        });
    }
});

router.post('/delete/proformaService', (req, res, next) => {
    const type = req.decoded.type;
    if (type == constants.USER.ADMIN) {
        const params = req.body;
        adminService.deleteProformaService(params)
            .then((service) => {
                res.json({
                    success: true,
                    result: service
                });
            }).catch((err) => {
                res.json({
                    success: false,
                    message: err
                });
            });
    } else {
        res.json({
            success: false,
            message: 'Not Authorized'
        });
    }
});

router.post('/add/proformaPayment', (req, res, next) => {
    const type = req.decoded.type;
    if (type == constants.USER.ADMIN) {
        const params = req.body;
        adminService.addProformaPayment(params)
            .then((data) => {
                res.json({
                    success: true,
                    result: data
                });
            }).catch((err) => {
                res.json({
                    success: false,
                    message: err
                });
            });
    } else {
        res.json({
            success: false,
            message: 'Not Authorized'
        });
    }
});

router.post('/get/proformaPayments', (req, res, next) => {
    const type = req.decoded.type;
    if (type == constants.USER.ADMIN) {
        const params = req.body;
        adminService.getProformaPayments(params)
            .then((data) => {
                res.json({
                    success: true,
                    result: data
                });
            }).catch((err) => {
                res.json({
                    success: false,
                    message: err
                });
            });
    } else {
        res.json({
            success: false,
            message: 'Not Authorized'
        });
    }
});

router.post('/delete/proformaPayment', (req, res, next) => {
    const type = req.decoded.type;
    if (type == constants.USER.ADMIN) {
        const params = req.body;
        adminService.deleteProformaPayment(params)
            .then((data) => {
                res.json({
                    success: true,
                    result: data
                });
            }).catch((err) => {
                res.json({
                    success: false,
                    message: err
                });
            });
    } else {
        res.json({
            success: false,
            message: 'Not Authorized'
        });
    }
});

router.post('/save/proforma', (req, res, next) => {
    const type = req.decoded.type;
    if (type == constants.USER.ADMIN) {
        const params = req.body;
        adminService.saveProforma(params)
            .then((data) => {
                res.json({
                    success: true,
                    result: data
                });
            }).catch((err) => {
                res.json({
                    success: false,
                    message: err
                });
            });
    } else {
        res.json({
            success: false,
            message: 'Not Authorized'
        });
    }
});
module.exports = router;