const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

const validationService = require('./validationService');
const models = require('../models');

module.exports = {

    signup: function(params) {
        return new Promise((resolve, reject) => {
            if (!params.mobile || !params.name /*|| !params.email*/) {
                reject('Missing params');
            } else {
                validationService.doesSuchUserExist(params.mobile).then(result => {
                    if (result) {
                        reject('This User Mobile no has been used. Try Login');
                    } else {
                        // prepare a self claim
                        const selfClaim = {};
                        // insert user info to db
                        models.user.create(params).then(user => {
                            selfClaim.userSsid = user.dataValues.ssid;
                            resolve(user.dataValues);
                        }).catch(err => {
                            console.log('Error occured while creating user:', err);
                            reject('Server side error');
                        });
                    }
                }).catch(err => {
                    console.log('User validation error', err);
                    reject('Server side error');
                });
            }
        });
    },

    getUser: function(params) {
        return new Promise((resolve, reject) => {
            if (!params.mobile) {
                reject('Invalid Request');
            } else {
                validationService.doesSuchUserExist(params.mobile)
                    .then(result => {
                        if (result) {
                            models.user.findOne({
                                where: {
                                    mobile: params.mobile
                                }
                            }).then(user => {
                                if (user) {
                                    resolve(user.dataValues);
                                }
                            }).catch(err => {
                                reject('Server side Error');
                            })
                        } else {
                            reject('User does not exist');
                        }
                    }).catch(err => {
                        console.log('User validation error', err);
                        reject('Server side error');
                    });
            }
        });
    },

    getLatestClaimHospitalInfo: function(params) {
        return new Promise((resolve, reject) => {
            models.selfClaim.findOne({
                where: {
                    userSsid: params.ssid
                },
                order: [
                    ['createdAt', 'DESC']
                ],
                include: [
                    {
                        model: models.hospitalInfo
                    }
                ]
            }).then(selfClaim => {
                resolve(selfClaim.hospitalInfo.dataValues);
            }).catch(err => {
                console.log('Error occured at getLatestClaimHospitalInfo ', err);
                reject('Server Side Error');
            });
        });
    },

    getSelfClaimHospitalInfo: function(params) {
        return new Promise((resolve, reject) => {
            validationService.doesSuchSelfClaimExist(params.scid)
                .then(result => {
                    if (result) {
                        models.selfClaim.findOne({
                            where: {
                                scid: params.scid
                            },
                            include: [
                                {
                                    model: models.hospitalInfo
                                }
                            ]
                        }).then(selfClaim => {
                            resolve(selfClaim.hospitalInfo.dataValues);
                        }).catch(err => {
                            console.log('Error occured at getLatestClaimHospitalInfo ', err);
                            reject('Server Side Error');
                        })
                    } else {
                        reject('SelfClaim does not exist');
                    }
                }).catch(err => {
                    console.log('SelfClaim validation error', err);
                    reject('Server side error');
                });
        });
    },

    getLatestSelfClaim: function(params) {
        return new Promise((resolve, reject) => {
            models.selfClaim.findOne({
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
            }).then(selfClaim => {
                resolve(selfClaim.dataValues);
            }).catch(err => {
                console.log('Error occured at getLatestSelfClaim ', err);
                reject('Server Side Error');
            });
        });
    },

    getSelfClaim: function(params) {
        return new Promise((resolve, reject) => {
            validationService.doesSuchSelfClaimExist(params.scid)
                .then(result => {
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
                        }).then(selfClaim => {
                            resolve(selfClaim.dataValues);
                        }).catch(err => {
                            console.log('Error occured at getSelfClaim ', err);
                            reject('Server Side Error');
                        });
                    } else {
                        reject('SelfClaim does not exist');
                    }
                }).catch(err => {
                    console.log('SelfClaim validation error', err);
                    reject('Server side error');
                });
        });
    },

    saveSelfClaim: function(params) {
        return new Promise((resolve, reject) => {
            if (!params.userSsid || !params.scid) {
                reject('Missing Params');
            } else {
                validationService.doesSuchUserExist(params.userSsid)
                    .then(result => {
                        if (result) {
                            models.selfClaim.findOne({
                                where: {
                                    scid: params.scid
                                }
                            }).then(selfClaim => {
                                if (selfClaim) {
                                    selfClaim.updateAttributes(params)
                                        .then(selfClaim => {
                                            resolve(selfClaim.dataValues);
                                        }).catch(err => {
                                            console.log('Error occured at saveSelfClaim', err);
                                            reject('Server side error');
                                        });
                                } else {
                                    reject('No such Self Claim exist');
                                }
                            }).catch(err => {
                                console.log('Error occured at saveSelfClaim', err);
                                reject('Server side error');
                            });
                        } else {
                            reject('No such User exist');
                        }
                    }).catch(err => {
                        console.log('Error occured at saveSelfClaim', err);
                        reject('Server side error');
                    });
            }
        });
    },

    saveUser: function(params) {
        return new Promise((resolve, reject) => {
            if (!params.ssid || !params.mobile) {
                reject('Missing Params');
            } else {
                models.user.findOne({
                    where: {
                        mobile: params.mobile
                    }
                }).then(user => {
                    if (user) {
                        user.updateAttributes(params)
                            .then(user => {
                                resolve(user.dataValues);
                            }).catch(err => {
                                console.log('Error occured at saveUser', err);
                                reject('Server side error');
                            });
                    } else {
                        reject('No such User exist');
                    }
                }).catch(err => {
                    console.log('Error occured at saveUser', err);
                    reject('Server side error');
                });
            }
        });
    },

    savePatient: function(params) {
        return new Promise((resolve, reject) => {
            if (!params.selfClaimScid || !params.id) {
                reject('Missing Params');
            } else {
                validationService.doesSuchSelfClaimExist(params.selfClaimScid)
                    .then(result => {
                        if (result) {
                            models.patient.findOne({
                                where: {
                                    id: params.id
                                }
                            }).then(patient => {
                                if (patient) {
                                    patient.updateAttributes(params)
                                        .then(patient => {
                                            resolve(patient.dataValues);
                                        }).catch(err => {
                                            console.log('Error occured at savePatient', err);
                                            reject('Server side error');
                                        });
                                } else {
                                    reject('No such Patient exist');
                                }
                            }).catch(err => {
                                console.log('Error occured at savePatient', err);
                                reject('Server side error');
                            });
                        } else {
                            reject('No such Self Claim exist');
                        }
                    }).catch(err => {
                        console.log('Error occured at savePatient', err);
                        reject('Server side error');
                    });
            }
        });
    },

    savePolicyHolder: function(params) {
        return new Promise((resolve, reject) => {
            if (!params.selfClaimScid || !params.id) {
                reject('Missing Params');
            } else {
                validationService.doesSuchSelfClaimExist(params.selfClaimScid)
                    .then(result => {
                        if (result) {
                            models.policyHolder.findOne({
                                where: {
                                    id: params.id
                                }
                            }).then(policyHolder => {
                                if (policyHolder) {
                                    policyHolder.updateAttributes(params)
                                        .then(policyHolder => {
                                            resolve(policyHolder.dataValues);
                                        }).catch(err => {
                                            console.log('Error occured at savePolicyHolder', err);
                                            reject('Server side error');
                                        });
                                } else {
                                    reject('No such PolicyHolder exist');
                                }
                            }).catch(err => {
                                console.log('Error occured at savePolicyHolder', err);
                                reject('Server side error');
                            });
                        } else {
                            reject('No such Self Claim exist');
                        }
                    }).catch(err => {
                        console.log('Error occured at savePolicyHolder', err);
                        reject('Server side error');
                    });
            }
        });
    },

    saveInsuranceInfo: function(params) {
        return new Promise((resolve, reject) => {
            if (!params.selfClaimScid || !params.id) {
                reject('Missing Params');
            } else {
                validationService.doesSuchSelfClaimExist(params.selfClaimScid)
                    .then(result => {
                        if (result) {
                            models.insuranceInfo.findOne({
                                where: {
                                    id: params.id
                                }
                            }).then(insuranceInfo => {
                                if (insuranceInfo) {
                                    insuranceInfo.updateAttributes(params)
                                        .then(insuranceInfo => {
                                            resolve(insuranceInfo.dataValues);
                                        }).catch(err => {
                                            console.log('Error occured at saveInsuranceInfo', err);
                                            reject('Server side error');
                                        });
                                } else {
                                    reject('No such InsuranecInfo exist');
                                }
                            }).catch(err => {
                                console.log('Error occured at saveInsuranceInfo', err);
                                reject('Server side error');
                            });
                        } else {
                            reject('No such Self Claim exist');
                        }
                    }).catch(err => {
                        console.log('Error occured at saveInsuranceInfo', err);
                        reject('Server side error');
                    });
            }
        });
    },

    saveHospitalInfo: function(params) {
        return new Promise((resolve, reject) => {
            if (!params.selfClaimScid || !params.id) {
                reject('Missing Params');
            } else {
                validationService.doesSuchSelfClaimExist(params.selfClaimScid)
                    .then(result => {
                        if (result) {
                            models.hospitalInfo.findOne({
                                where: {
                                    id: params.id
                                }
                            }).then(hospitalInfo => {
                                if (hospitalInfo) {
                                    hospitalInfo.updateAttributes(params)
                                        .then(hospitalInfo => {
                                            resolve(hospitalInfo.dataValues);
                                        }).catch(err => {
                                            console.log('Error occured at saveHospitalInfo', err);
                                            reject('Server side error');
                                        });
                                } else {
                                    reject('No such HospitalInfo exist');
                                }
                            }).catch(err => {
                                console.log('Error occured at saveHospitalInfo', err);
                                reject('Server side error');
                            });
                        } else {
                            reject('No such Self Claim exist');
                        }
                    }).catch(err => {
                        console.log('Error occured at saveHospitalInfo', err);
                        reject('Server side error');
                    });
            }
        });
    },

    saveCommunicationInfo: function(params) {
        return new Promise((resolve, reject) => {
            if (!params.selfClaimScid || !params.id) {
                reject('Missing Params');
            } else {
                validationService.doesSuchSelfClaimExist(params.selfClaimScid)
                    .then(result => {
                        if (result) {
                            models.communicationInfo.findOne({
                                where: {
                                    id: params.id
                                }
                            }).then(communicationInfo => {
                                if (communicationInfo) {
                                    communicationInfo.updateAttributes(params)
                                        .then(communicationInfo => {
                                            resolve(communicationInfo.dataValues);
                                        }).catch(err => {
                                            console.log('Error occured at saveCommunicationInfo', err);
                                            reject('Server side error');
                                        });
                                } else {
                                    reject('No such CommunicationInfo exist');
                                }
                            }).catch(err => {
                                console.log('Error occured at saveCommunicationInfo', err);
                                reject('Server side error');
                            });
                        } else {
                            reject('No such Self Claim exist');
                        }
                    }).catch(err => {
                        console.log('Error occured at saveCommunicationInfo', err);
                        reject('Server side error');
                    });
            }
        });
    },

    saveTreatmentInfo: function(params) {
        return new Promise((resolve, reject) => {
            if (!params.selfClaimScid || !params.id) {
                reject('Missing Params');
            } else {
                validationService.doesSuchSelfClaimExist(params.selfClaimScid)
                    .then(result => {
                        if (result) {
                            models.treatmentInfo.findOne({
                                where: {
                                    id: params.id
                                }
                            }).then(treatmentInfo => {
                                if (treatmentInfo) {
                                    treatmentInfo.updateAttributes(params)
                                        .then(treatmentInfo => {
                                            resolve(treatmentInfo.dataValues);
                                        }).catch(err => {
                                            console.log('Error occured at saveTreatmentInfo', err);
                                            reject('Server side error');
                                        });
                                } else {
                                    reject('No such InsuranecInfo exist');
                                }
                            }).catch(err => {
                                console.log('Error occured at saveTreatmentInfo', err);
                                reject('Server side error');
                            });
                        } else {
                            reject('No such Self Claim exist');
                        }
                    }).catch(err => {
                        console.log('Error occured at saveTreatmentInfo', err);
                        reject('Server side error');
                    });
            }
        });
    },

    getInsurers: function(params) {
        return new Promise((resolve, reject) => {
            models.insurer.findAll({
                attributes: [
                    'id', 'name'
                ]
            }).then(insurers => {
                if (insurers.length > 0) {
                    const records = [];
                    for (let i = 0; i < insurers.length; i++) {
                        records[i] = insurers[i].dataValues;
                    }
                    resolve(records);
                } else {
                    resolve([]);
                }
            }).catch(function(err) {
                console.log('Error occured while getting insurers ', err);
                reject('Server Side Error');
            });
        });
    },

    getTpas: function(params) {
        return new Promise((resolve, reject) => {
            models.tpa.findAll({
                attributes: [
                    'id', 'name'
                ]
            }).then(tpas => {
                if (tpas.length > 0) {
                    const records = [];
                    for (let i = 0; i < tpas.length; i++) {
                        records[i] = tpas[i].dataValues;
                    }
                    resolve(records);
                } else {
                    resolve([]);
                }
            }).catch(function(err) {
                console.log('Error occured while getting tpas ', err);
                reject('Server Side Error');;
            });
        });
    },

    getStates: function(params) {
        return new Promise((resolve, reject) => {
            models.state.findAll({
                attributes: [
                    'id', 'name'
                ]
            }).then(states => {
                if (states.length > 0) {
                    const records = [];
                    for (let i = 0; i < states.length; i++) {
                        records[i] = states[i].dataValues;
                    }
                    resolve(records);
                } else {
                    resolve([]);
                }
            }).catch(function(err) {
                console.log('Error occured while getting states ', err);
                reject('Server Side Error');;
            });
        });
    },

    updateBill: function(params) {
        return new Promise((resolve, reject) => {
            if (!params.selfClaimScid || !params.id) {
                reject('Missing Params');
            } else {
                validationService.doesSuchSelfClaimExist(params.selfClaimScid)
                    .then(result => {
                        if (result) {
                            models.bill.findOne({
                                where: {
                                    id: params.id
                                }
                            }).then(bill => {
                                if (bill) {
                                    bill.updateAttributes(params)
                                        .then(bill => {
                                            resolve(bill.dataValues);
                                        }).catch(err => {
                                            console.log('Error occured at updateBill', err);
                                            reject('Server side error');
                                        });
                                } else {
                                    reject('No such Bill exist');
                                }
                            }).catch(err => {
                                console.log('Error occured at updateBill', err);
                                reject('Server side error');
                            });
                        } else {
                            reject('No such Self Claim exist');
                        }
                    }).catch(err => {
                        console.log('Error occured at updateBill', err);
                        reject('Server side error');
                    });
            }
        });
    },

    createBill: function(params) {
        return new Promise((resolve, reject) => {
            if (!params.selfClaimScid) {
                reject('Missing Params');
            } else {
                validationService.doesSuchSelfClaimExist(params.selfClaimScid)
                    .then(result => {
                        if (result) {
                            models.bill.create(params).then(bill => {
                                resolve(bill.dataValues);
                            }).catch(err => {
                                console.log('Error occured while creating bill:', err);
                                reject('Server side error');
                            });
                        } else {
                            reject('No such Self Claim exist');
                        }
                    }).catch(err => {
                        console.log('Error occured at createBill', err);
                        reject('Server side error');
                    });
            }
        });
    },

    createAddress: function(params) {
        return new Promise((resolve, reject) => {
            if (params.id) {
                reject('Invalid address');
            } else {
                models.address.create(params).then(address => {
                    resolve(address.dataValues);
                }).catch(err => {
                    console.log('Error occured while creating address:', err);
                    reject('Server side error');
                });
            }
        });
    },

    updateAddress: function(params) {
        return new Promise((resolve, reject) => {
            if (!params.id) {
                reject('Missing Params');
            } else {
                models.address.findOne({
                    where: {
                        id: params.id
                    }
                }).then(address => {
                    if (address) {
                        address.updateAttributes(params)
                            .then(address => {
                                resolve(address.dataValues);
                            }).catch(err => {
                                console.log('Error occured at updateAddress', err);
                                reject('Server side error');
                            });
                    } else {
                        reject('No such Address exist');
                    }
                }).catch(err => {
                    console.log('Error occured at updateAddress', err);
                    reject('Server side error');
                });
            }
        });
    },

    getBills: function(params) {
        return new Promise((resolve, reject) => {
            if (!params.selfClaimScid) {
                reject('Missing Params');
            } else {
                validationService.doesSuchSelfClaimExist(params.selfClaimScid)
                    .then(result => {
                        if (result) {
                            models.bill.findAll({
                                where: {
                                    isActive: true,
                                    selfClaimScid: params.selfClaimScid
                                }
                            }).then(bills => {
                                if (bills.length > 0) {
                                    const records = [];
                                    for (let i = 0; i < bills.length; i++) {
                                        records[i] = bills[i].dataValues;
                                    }
                                    resolve(records);
                                } else {
                                    resolve([]);
                                }
                            }).catch(function(err) {
                                console.log('Error occured while getting bills ', err);
                                reject('Server Side Error');
                            });
                        } else {
                            reject('No such Self Claim exist');
                        }
                    }).catch(err => {
                        console.log('Error occured at getBills', err);
                        reject('Server side error');
                    });
            }
        });
    },

    createReceipt: function(params) {
        return new Promise((resolve, reject) => {
            if (!params.selfClaimScid) {
                reject('Missing Params');
            } else {
                validationService.doesSuchSelfClaimExist(params.selfClaimScid)
                    .then(result => {
                        if (result) {
                            models.receipt.create(params).then(receipt => {
                                resolve(receipt.dataValues);
                            }).catch(err => {
                                console.log('Error occured while creating receipt:', err);
                                reject('Server side error');
                            });
                        } else {
                            reject('No such Self Claim exist');
                        }
                    }).catch(err => {
                        console.log('Error occured at createReceipt', err);
                        reject('Server side error');
                    });
            }
        });
    },

    updateReceipt: function(params) {
        return new Promise((resolve, reject) => {
            if (!params.selfClaimScid || !params.id) {
                reject('Missing Params');
            } else {
                validationService.doesSuchSelfClaimExist(params.selfClaimScid)
                    .then(result => {
                        if (result) {
                            models.receipt.findOne({
                                where: {
                                    id: params.id
                                }
                            }).then(receipt => {
                                if (receipt) {
                                    receipt.updateAttributes(params)
                                        .then(receipt => {
                                            resolve(receipt.dataValues);
                                        }).catch(err => {
                                            console.log('Error occured at updateReceipt', err);
                                            reject('Server side error');
                                        });
                                } else {
                                    reject('No such Receipt exist');
                                }
                            }).catch(err => {
                                console.log('Error occured at updateReceipt', err);
                                reject('Server side error');
                            });
                        } else {
                            reject('No such Self Claim exist');
                        }
                    }).catch(err => {
                        console.log('Error occured at updateReceipt', err);
                        reject('Server side error');
                    });
            }
        });
    },

    getReceipts: function(params) {
        return new Promise((resolve, reject) => {
            if (!params.selfClaimScid) {
                reject('Missing Params');
            } else {
                validationService.doesSuchSelfClaimExist(params.selfClaimScid)
                    .then(result => {
                        if (result) {
                            models.receipt.findAll({
                                where: {
                                    isActive: true,
                                    selfClaimScid: params.selfClaimScid
                                }
                            }).then(receipts => {
                                if (receipts.length > 0) {
                                    const records = [];
                                    for (let i = 0; i < receipts.length; i++) {
                                        records[i] = receipts[i].dataValues;
                                    }
                                    resolve(records);
                                } else {
                                    resolve([]);
                                }
                            }).catch(function(err) {
                                console.log('Error occured while getting receipts ', err);
                                reject('Server Side Error');
                            });
                        } else {
                            reject('No such Self Claim exist');
                        }
                    }).catch(err => {
                        console.log('Error occured at getReceipts', err);
                        reject('Server side error');
                    });
            }
        });
    },

    addClaimCalculatorUser: (params) => {
        return new Promise((resolve, reject) => {
            models.claimCalculator.create({
                dateOfAdmission: params.dateOfAdmission,
                dateOfDischarge: params.dateOfDischarge,
                ipAddress: params.ipAddress
            }).then((result) => {
                resolve(result);
            }).catch((err) => {
                console.log('Error occured while adding claim calculator user ', err);
                reject('Error occured!');
            });
        });
    },

    addClaimCalculatorBill: (params) => {
        return new Promise((resolve, reject) => {
            models.claimCalculatorBills.create({
                billDate: params.billDate,
                billAmount: params.billAmount,
                billNumber: params.billNumber,
                billType: params.billType,
                claimCalculatorId: params.claimCalculatorId
            }).then((result) => {
                resolve(result);
            }).catch((err) => {
                console.log('Error occured while adding claim calculator bill ', err);
                reject('Error occured!');
            });
        });
    },

    updateClaimCalculatorBill: (params) => {
        return new Promise((resolve, reject) => {
            models.claimCalculatorBills.findOne({
                where: {
                    id: params.billId
                }
            }).then((result) => {
                if (result) {
                    result.updateAttributes(params)
                    .then(updatedData => {
                        resolve(updatedData);
                    }).catch(err => {
                        console.log('Error occured at updateClaimCalculatorBill', err);
                        reject('Server side error');
                    });
                } else {
                    reject('No such bill exist');
                }
            }).catch((err) => {
                console.log('Error occured while updating claim calculator bill ', err);
                reject('Error occured!');
            });
        });
    },

    deleteClaimCalculatorBill: (params) => {
        return new Promise((resolve, reject) => {
            models.claimCalculatorBills.destroy({
                where: {
                    id: params.id
                }
            }).then((result) => {
                resolve(result);
            }).catch((err) => {
                console.log('Error occured while deleting claim calculator bill ', err);
                reject('Error occured!');
            });
        });
    },

    showClaimCalculatorBills: (params) => {
        return new Promise((resolve, reject) => {
            models.claimCalculatorBills.findAll({
                where: {
                    claimCalculatorId: params.claimCalculatorId
                }
            }).then((result) => {
                resolve(result);
            }).catch((err) => {
                console.log('Error occured while adding claim calculator bill ', err);
                reject('Error occured!');
            });
        });
    }
};