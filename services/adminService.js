/**
 * @author Varun Kumar<varunon9@gmail.com>
 * https://github.com/varunon9
 * Date: 18 April, 2018
 */

const models = require('../models');

const validationService = require('../services/validationService');
const Op = require('sequelize').Op;

module.exports = {

    getAdmin: function(params, failureCallback, successCallback) {
        return new Promise((resolve, reject) => {
            if (!params.mobile) {
                reject('Invalid Request');
            } else {
                validationService.doesSuchAdminExist(params.mobile)
                    .then(result => {
                        if (result) {
                            models.admin.findOne({
                                where: {
                                    mobile: params.mobile
                                },
                                attributes: [
                                    'id', 'mobile', 'name', 'gender', 'email', 
                                    'organisation', 'type', 'createdAt'
                                ]
                            }).then(admin => {
                                if (admin) {
                                    resolve(admin.dataValues);
                                }
                            }).catch(err => {
                                reject('Server side Error');
                            })
                        } else {
                            reject('Admin does not exist');
                        }
                    }).catch(err => {
                        console.log('Admin validation error', err);
                        reject('Server side error');
                    });
            }
        });
    },

    getAdmins: function(params, failureCallback, successCallback) {
        models.admin.findAll({
            where: {
                deactivated: false
            },
            offset: params.offset || 0,
            limit: params.limit || 50,
            attributes: [
                'id', 'mobile', 'name', 'gender', 'email', 
                'organisation', 'type', 'createdAt', 'updatedAt'
            ]
        }).then(function(admins) {
            const records = [];
            for (let i = 0; i < admins.length; i++) {
                records[i] = admins[i].dataValues;
            }
            successCallback(records);
        }).catch(function(err) {
            console.log('Error occured while getting admins ', err);
            failureCallback('Error occured!');
        });
    },

    getUsers: function(params, failureCallback, successCallback) {
        models.user.findAll({
            where: {
                deactivated: false
            },
            offset: params.offset || 0,
            limit: params.limit || 50,
            attributes: [
                'ssid', 'mobile', 'name', 'gender', 'email', 'createdAt'
            ]
        }).then(function(users) {
            const records = [];
            for (let i = 0; i < users.length; i++) {
                records[i] = users[i].dataValues;
            }
            successCallback(records);
        }).catch(function(err) {
            console.log('Error occured while getting users ', err);
            failureCallback('Error occured!');
        });
    },

    getSelfClaims: (params) => {
        return new Promise((resolve, reject) => {
            models.selfClaim.findAll({
                include: [
                    {
                        model: models.user,
                        attributes: [
                            'ssid', 'mobile', 'name', 'gender', 'email', 'createdAt'
                        ]
                    }
                ],
                offset: params.offset || 0,
                limit: params.limit || 50
            }).then((selfClaims) => {
                const records = [];
                for (let i = 0; i < selfClaims.length; i++) {
                    records[i] = selfClaims[i].dataValues;
                }
                resolve(records);
            }).catch((err) => {
                console.log('Error occured while getting selfClaims ', err);
                reject('Error occured!');
            });
        });
    },

    addNewService: (params) => {
        return new Promise((resolve, reject) => {
            models.service.create({
                serviceName: params.serviceName,
                serviceType: params.serviceType,
                price: params.servicePrice
                }).then((selfClaims) => {
                const records = [];
                for (let i = 0; i < selfClaims.length; i++) {
                    records[i] = selfClaims[i].dataValues;
                }
                resolve(records);
            }).catch((err) => {
                console.log('Error occured while creating new services ', err);
                reject('Error occured!');
            });
        });
    },

    getAdminServices: (params) => {
        return new Promise((resolve, reject) => {
            models.service.findAll().then((services) => {
                const records = [];
                for (let i = 0; i < services.length; i++) {
                    records[i] = services[i].dataValues;
                }
                resolve(records);
            }).catch((err) => {
                console.log('Error occured while getting services ', err);
                reject('Error occured!');
            });
        });
    },

    getSelfClaimData: (params) => {
        return new Promise((resolve, reject) => {
            validationService.doesSuchSelfClaimExist(params.scid)
                .then((result) => {
                    if (result) {
                        models.selfClaim.findOne({
                            where: {
                                scid: params.scid
                            },
                            include: [
                                {
                                    model: models.hospitalInfo
                                },
                                {
                                    model: models.patient
                                },
                                {
                                    model: models.policyHolder,
                                    include: [
                                        {
                                            model: models.address
                                        }
                                    ]
                                },
                                {
                                    model: models.insuranceInfo,
                                    include: [
                                        {
                                            model: models.tpa
                                        },
                                        {
                                            model: models.insurer
                                        }
                                    ]
                                },
                                {
                                    model: models.bill
                                },
                                {
                                    model: models.receipt
                                },
                                {
                                    model: models.treatmentInfo
                                },
                                {
                                    model: models.communicationInfo,
                                    include: [
                                        {
                                            model: models.address
                                        }
                                    ]
                                },
                                {
                                    model: models.user
                                }
                            ]
                        }).then((selfClaim) => {
                            resolve(selfClaim.dataValues);
                        }).catch((err) => {
                            console.log('Error occured while getting selfClaimData ', err);
                            reject('Error occured!');
                        });
                    } else {
                        reject('No such SelfClaim exist');
                    }
                }).catch((err) => {
                    console.log('Error occured while validating selfClaimData ', err);
                    reject('Error occured!');
                });
        });
    },

    getAllProformas: (params) => {
        var param1;
        var param2;
        if (params.sortBy == 'date_DESC') {
            param1 = 'createdAt';
            param2 = 'DESC';
        } else if (params.sortBy == 'date_ASC') {
             param1 = 'createdAt';
            param2 = 'ASC';
        } else if (params.sortBy == 'date_DESC') {
            param1 = 'createdAt';
            param2 = 'DESC';
        } else if (params.sortBy == 'name_DESC') {
             param1 = 'patientName';
            param2 = 'DESC';
        } else if (params.sortBy == 'name_ASC') {
             param1 = 'patientName';
            param2 = 'ASC';
        } else {
            param1 = 'createdAt';
            param2 = 'DESC';
        }
        return new Promise((resolve, reject) => {
            models.proforma.findAll({
                include: [
                {
                    model: models.user
                },
                {
                    model: models.paymentInfo
                },
                {
                    model: models.proformaItem
                }
                ],
                order: [[param1, param2]]
            }).then((data) => {
                resolve(data);
            }).catch((err) => {
                console.log('Error occured while getting all proformas ', err);
                reject('Error occured!');
            });
        });
    },

    deleteProforma: (params) => {
        return new Promise((resolve, reject) => {
            models.proforma.destroy({
                where: {
                    id: params.id
                }
            }).then((data) => {
                resolve(data);
            }).catch((err) => {
                console.log('Error occured while getting all proformas ', err);
                reject('Error occured!');
            });
        });
    },

    searchProformaDateWise: (params) => {
        return new Promise((resolve, reject) => {
            models.proforma.findAll({
                where: {
                    createdAt: {
                        $between: [params.dateFrom, params.dateTo]
                    } 
                },
                include: [
                {
                    model: models.user
                },
                {
                    model: models.paymentInfo
                },
                {
                    model: models.proformaItem
                }
                ]
                
            }).then((data) => {
                resolve(data);
            }).catch((err) => {
                console.log('Error occured while getting all proformas ', err);
                reject('Error occured!');
            });
        });
    },

    searchProformaByMobile: (params) => {
        return new Promise((resolve, reject) => {
            models.proforma.findAll({
                include: [
                {
                    model: models.user,
                },
                {
                    model: models.paymentInfo
                },
                {
                    model: models.proformaItem
                }
                ],
                where: {
                    '$user.mobile$': params.mobileNumber
                }
            }).then((data) => {
                resolve(data);
            }).catch((err) => {
                console.log('Error occured while getting all proformas ', err);
                reject('Error occured!');
            });
        });
    },

    searchProformaByPatient: (params) => {
        return new Promise((resolve, reject) => {
            models.proforma.findAll({
                where: {
                    patientName: {
                        [Op.like]: '%' + params.patientName + '%'
                    } 
                },
                include: [
                {
                    model: models.user
                },
                {
                    model: models.paymentInfo
                },
                {
                    model: models.proformaItem
                }
                ]
                
            }).then((data) => {
                resolve(data);
            }).catch((err) => {
                console.log('Error occured while getting all proformas ', err);
                reject('Error occured!');
            });
        });
    },

    deleteService: (params) => {
        return new Promise((resolve, reject) => {
            models.service.destroy({
                where: {
                    id: params.id
                }
            }).then((data) => {
                resolve(data);
            }).catch((err) => {
                console.log('Error occured while getting all proformas ', err);
                reject('Error occured!');
            });
        });
    },

    getProformaData: (params) => {
        return new Promise((resolve, reject) => {
            models.proforma.findOne({
                where: {
                    id: params.id
                },
                include: [
                {
                    model: models.proformaItem
                },
                {
                    model: models.paymentInfo
                },
                {
                    model: models.user
                },
                ]
            }).then((data) => {
                resolve(data);
            }).catch((err) => {
                console.log('Error occured while getting all proformas ', err);
                reject('Error occured!');
            });
        });
    },

    getAllServices: () => {
        return new Promise((resolve, reject) => {
            models.service.findAll().then((selfClaim) => {
                resolve(selfClaim);
            }).catch((err) => {
                console.log('Error occured while getting services ', err);
                reject('Error occured!');
            });
        });
    },

    searchProformaUser: (params) => {
        return new Promise((resolve, reject) => {
            models.user.findOne({
                where: {
                            mobile: params.searchNumber,
                            name: {
                                [Op.like]: '%' + params.searchName + '%'
                            }
                        }
            }).then((services) => {
                resolve(services);
            }).catch((err) => {
                console.log('Error occured while getting services ', err);
                reject('Error occured!');
            });
        });
    },

    addUser: (params) => {
        return new Promise((resolve, reject) => {
            models.user.create({
                mobile: params.mobile,
                name: params.name,
                email: params.email
            }).then((services) => {
                resolve(services);
            }).catch((err) => {
                console.log('Error occured while adding new user ', err);
                reject('Error occured!');
            });
        });
    },

    getUserSsid: (params) => {
        return new Promise((resolve, reject) => {
            models.user.findOne({
                where: {
                            mobile: params.mobile
                        }
            }).then((userId) => {
                resolve(userId);
            }).catch((err) => {
                console.log('Error occured while getting user Ssid ', err);
                reject('Error occured!');
            });
        });
    },

    createNewProforma: (params) => {
        return new Promise((resolve, reject) => {
            models.proforma.create({
                userSsid: params.ssid,
                include: [
                {
                    model: models.proformaItem
                }
                ]
            }).then((userId) => {
                resolve(userId);
            }).catch((err) => {
                console.log('Error occured while getting user Ssid ', err);
                reject('Error occured!');
            });
        });
    },

    addProformaService: (params) => {
        console.log(params);
        return new Promise((resolve, reject) => {
            models.proformaItem.create({
                proformaId: params.proforma,
                serviceId: params.service,
                updatedPrice: params.price,
                quantity: params.qty,
                adminId: params.admin
            }).then((userId) => {
                resolve(userId);
            }).catch((err) => {
                console.log('Error occured while adding proforma services ', err);
                reject('Error occured!');
            });
        });
    },

    checkProformaService: (params) => {
        return new Promise((resolve, reject) => {
            models.proformaItem.findAll({
                where: {
                    proformaId: params.proformaId,
                    serviceId: params.serviceId
                }
            }).then((result) => {
                const records = [];
                for (let i = 0; i < result.length; i++) {
                    records[i] = result[i].dataValues;
                }
                resolve(records);
            }).catch((err) => {
                console.log('Error occured while checking proforma services ', err);
                reject('Error occured!');
            });
        });
    },

    displayProformaService: (params) => {
        return new Promise((resolve, reject) => {
            models.proformaItem.findAll({
                where: {
                    proformaId: params.proformaId
                },
                include: [
                {
                    model: models.service
                }
                ]
            }).then((userId) => {
                resolve(userId);
            }).catch((err) => {
                console.log('Error occured while adding proforma services ', err);
                reject('Error occured!');
            });
        });
    },

    deleteProformaService: (params) => {
        return new Promise((resolve, reject) => {
            models.proformaItem.destroy({
                where: {
                    id: params.id
                }
            }).then((userId) => {
                resolve(userId);
            }).catch((err) => {
                console.log('Error occured while deleting proforma services ', err);
                reject('Error occured!');
            });
        });
    },

    addProformaPayment: (params) => {
        return new Promise((resolve, reject) => {
            models.paymentInfo.create({
                amount: params.amount,
                receivedDate: params.receivedDate,
                paymentMode: params.paymentMode,
                receivedBy: params.receivedBy,
                proformaId: params.proformaId
            }).then((result) => {
                resolve(result);
            }).catch((err) => {
                console.log('Error occured while adding proforma payment ', err);
                reject('Error occured!');
            });
        });
    },

    getProformaPayments: (params) => {
        return new Promise((resolve, reject) => {
            models.paymentInfo.findAll({
                where: {
                    proformaId: params.proformaId
                }
            }).then((result) => {
                resolve(result);
            }).catch((err) => {
                console.log('Error occured while adding proforma payment ', err);
                reject('Error occured!');
            });
        });
    },

    deleteProformaPayment: (params) => {
        return new Promise((resolve, reject) => {
            models.paymentInfo.destroy({
                where: {
                    id: params.id
                }
            }).then((result) => {
                resolve(result);
            }).catch((err) => {
                console.log('Error occured while adding proforma payment ', err);
                reject('Error occured!');
            });
        });
    },

    saveProforma: (params) => {
        return new Promise((resolve, reject) => {
            models.proforma.findOne({
                where: {
                    id: params.proformaId
                }
            }).then((proformaData) => {
                if (proformaData) {
                    proformaData.updateAttributes(params)
                    .then(proformaData => {
                        resolve(proformaData);
                        }).catch(err => {
                    console.log('Error occured at saveProforma', err);
                    reject('Server side error');
                    });
                } else {
                    reject('No such Profile exist');
                }
            }).catch(err => {
                console.log('Error occured at saveProforma', err);
                reject('Server side error');
            });
        });
    }
};
