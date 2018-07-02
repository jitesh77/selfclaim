/**
 * @author Varun Kumar<varunon9@gmail.com>
 * https://github.com/varunon9
 * Date: 18 April, 2018
 */

const models = require('../models');

const validationService = require('../services/validationService');

module.exports = {

    getUserClaims: (params) => {
        return new Promise((resolve, reject) => {
            models.selfClaim.findAll({
                attributes: [
                    [models.sequelize.fn('COUNT', models.sequelize.col('scid')), 'count']
                ],
                where: {
                    userSsid: params.ssid
                }
            }).then((selfClaims) => {
                const records = [];
                for (let i = 0; i < selfClaims.length; i++) {
                    records[i] = selfClaims[i].dataValues;
                }
                resolve(records);
            }).catch((err) => {
                console.log('Error occured while getting userSelfClaims ', err);
                reject('Error occured!');
            });
        });
    },

    getUserClaimData: (params) => {
        return new Promise((resolve, reject) => {
            models.selfClaim.findAll({
                where: {
                    userSsid: params.ssid
                },
                order: [
                    ['createdAt', 'DESC']
                ],
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
                const records = [];
                for (let i = 0; i < selfClaim.length; i++) {
                    records[i] = selfClaim[i].dataValues;
                }
                resolve(records);
                }).catch((err) => {
                    console.log('Error occured while getting selfClaimData ', err);
                    reject('Error occured!');
            });
        });                  
    },

    createNewSelfClaim: (params) => {
        return new Promise((resolve, reject) => {
            const selfClaim = {};
            selfClaim.userSsid = params.ssid;
            models.user.findOne({
                where: {
                    ssid: params.ssid
                }
            }).then(user => {
                models.selfClaim.create(selfClaim).then(selfClaim => {

                    // insert patient into db
                    models.patient.create({
                    selfClaimScid: selfClaim.dataValues.scid
                    }).then(patient => {

                        // insert hospital info to db
                        models.hospitalInfo.create({
                        selfClaimScid: selfClaim.dataValues.scid
                        }).then(hospitalInfo => {

                            // insert insurance info to db
                            models.insuranceInfo.create({
                            selfClaimScid: selfClaim.dataValues.scid
                            }).then(insuranceInfo => {

                                // insert treatment info to db
                                models.treatmentInfo.create({
                                selfClaimScid: selfClaim.dataValues.scid
                                }).then(treatmentInfo => {

                                    // insert communication info to db
                                    models.communicationInfo.create({
                                    selfClaimScid: selfClaim.dataValues.scid
                                    }).then(communicationInfo => {

                                        // insert policy holder info to db
                                        models.policyHolder.create({
                                        selfClaimScid: selfClaim.dataValues.scid
                                        }).then(policyHolder => {
                                            
                                            // everything went smooth
                                            resolve(selfClaim.dataValues.scid);
                                        }).catch(err => {
                                            console.log('Error occured while creating policyHolder:', err);
                                            reject('Server side error');
                                        });
                                    }).catch(err => {
                                        console.log('Error occured while creating communicationInfo:', err);
                                        reject('Server side error');
                                    });
                                }).catch(err => {
                                    console.log('Error occured while creating treatmentInfo:', err);
                                    reject('Server side error');
                                });
                            }).catch(err => {
                                console.log('Error occured while creating insuranceInfo:', err);
                                reject('Server side error');
                            });
                        }).catch(err => {
                            console.log('Error occured while creating hospitalInfo:', err);
                            reject('Server side error');
                        });
                    }).catch(err => {
                        console.log('Error occured while creating patient:', err);
                        reject('Server side error');
                    });
                }).catch(err => {
                    console.log('Error occured while creating selfClaim:', err);
                    reject('Server side error');
                });
            }).catch(err => {
                console.log('Error occured while using user:', err);
                reject('Server side error');
            });
        });
             
    },

    getUserServices: (params) => {
        return new Promise((resolve, reject) => {
            models.serviceRegistration.findAll({
                include: [
                    {
                        model: models.service
                    }
                ]
            }).then((userServices) => {
                resolve(userServices);
            }).catch((err) => {
                console.log('Error occured while getting userServices ', err);
                reject('Error occured!');
            });
        });
    },

    getUserProfile: (params) => {
        return new Promise((resolve, reject) => {
            models.user.findOne({
                where: {
                    ssid: params.ssid
                }
            }).then((selfClaims) => {
                resolve(selfClaims);
            }).catch((err) => {
                console.log('Error occured while getting userSelfClaims ', err);
                reject('Error occured!');
            });
        });
    },

    saveUserProfile: function(params) {
        return new Promise((resolve, reject) => {
            models.user.findOne({
                where: {
                    ssid: params.ssid
                }
            }).then(userProfileUpdate => {
                if (userProfileUpdate) {
                    userProfileUpdate.updateAttributes(params)
                        .then(userProfileUpdate => {
                            resolve(userProfileUpdate);
                        }).catch(err => {
                            console.log('Error occured at saveUserProfile', err);
                            reject('Server side error');
                        });
                } else {
                    reject('No such Profile exist');
                }
            }).catch(err => {
                console.log('Error occured at saveTreatmentInfo', err);
                reject('Server side error');
            });
        });
    }
}