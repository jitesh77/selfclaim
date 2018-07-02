const fs = require('fs');

const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

const request = require('request');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

const redisApi = require('./redisApi.js');

const constants = require('../data/constants.js');

module.exports = {

    getToken: function(user) {
        let expiresIn = 2 * 60 * 60 // expires in 2 hours
        if (user.keepMeLoggedIn) {
            expiresIn = 7 * 24 * 60 * 60 // expires in 7 days
        }

        // create a token
        const token = jwt.sign({
            mobile: user.mobile,
            name: user.name ? user.name : user.mobile,
            ssid: user.ssid,
            type: user.type || constants.USER.OPTIMUS,
            email: user.email
        }, config.superSecret, {
            expiresIn: expiresIn
        });
        return token;
    },

    getAdminToken: function(admin) {
        let expiresIn = 2 * 60 * 60 // expires in 2 hours

        // create a token
        const token = jwt.sign({
            mobile: admin.mobile,
            name: admin.name,
            id: admin.id,
            type: admin.type || constants.USER.ADMIN,
            email: admin.email
        }, config.superSecret, {
            expiresIn: expiresIn
        });
        return token;
    },

    getEncryptedScid: function(scid) {
        
        // create a token
        const encryptedScid = jwt.sign({
            selfClaimScid: scid
        }, config.superSecret, {
          expiresIn: 2 * 60 * 60 // expires in 2 hours
        });
        return encryptedScid;
    },

    generateOTP: function() {

        // 6 digits OTP
        const min = 100000;
        const max = 999999;

        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    sendEmail: function(account, params, failureCallback, successCallback) {

        // create reusable transporter object using the default SMTP transport
        let smtpTransport;

        if (account.host) {
            smtpTransport = nodemailer.createTransport({
                host: account.host,
                port: 465,
                secure: true, // true for 465, false for other ports
                auth: {
                    user: account.user, // generated ethereal user
                    pass: account.password  // generated ethereal password
                }
            });
        } else {
            smtpTransport = nodemailer.createTransport({
                service: 'Gmail', // sets automatically host, port and connection security settings
                auth: {
                    user: account.user, 
                    pass: account.password  
                }
            });
        }

        let toEmail = params.to[0];
        for (let i = 1; i < params.to.length; i++) {
            toEmail += ', ' + params.to[i];
        }

        // setup email data with unicode symbols
        const mailOptions = {
            from: params.from, // sender address
            to: toEmail, // list of receivers
            subject: params.subject, // Subject line
            text: params.text, // plain text body
            html: params.html, // html body
            attachments: params.attachments
        };

        // send mail with defined transport object
        smtpTransport.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error while sending mail: ' + error);
                failureCallback(mailOptions);
            } else {
                console.log('Message sent: %s', info.messageId);
                successCallback(mailOptions);
            }
            smtpTransport.close(); // shut down the connection pool, no more messages.
        });
    },

    emailFile: function(file, decoded) {
        // send email using gmail account
        const gmailAccount = config.gmailAccount;
        const subject = 'SureServe- File Uploaded: ' + file.name + ' by ' + decoded.name + 
                ', mobile: ' + decoded.mobile; 
        const params = {
            from: gmailAccount.user,
            to: gmailAccount.toEmails,
            subject: subject,
            text: '',
            html: '',
            attachments: [
                {
                    filename: file.name,
                    path: file.path
                }
            ]
        };

        this.sendEmail(gmailAccount, params, function failureCallback(params) {
            console.log('Not deleted: ', params.attachments);
        }, function successCallback(params) {

            // delete files from hard-disk
            const attachments = params.attachments;

            attachments.forEach(function(attachment) {
                fs.unlink(attachment.path, (err) => {
                    if (err) {
                        console.log('Error occured while deleting file: ', err);
                    } else {
                        console.log(attachment.filename + ' deleted successfully');
                    }
                });
            });
        });
    },

    sendWelcomeMail: function(user) {
        const ssEmailAccount = config.ssEmailAccount;
        const subject = 'Welcome to SureServe!!';
        const bodyText = 'Hello ' + user.name + ' and welcome to SureServe.\n';
        bodyText += 'You have been successfully registered with mobile no : ' + user.mobile + '. ';
        bodyText += 'Your ssid is: ' + user.ssid + '.\n\n';
        bodyText += 'For any query, please contact: 9019410101 | 08030695769 | fhb@sureserve.in';

        const params = {
            from: ssEmailAccount.user,
            to: [user.email],
            subject: subject,
            text: bodyText,
            html: '',
            attachments: []
        };

        this.sendEmail(ssEmailAccount, params, function failureCallback(params) {
            console.log('Welcome Mail not sent to: ' + params.to);
        }, function successCallback(params) {
            console.log('successfully sent Welcome Mail to: ' + params.to);
        });
    },

    sendServiceSignupMailToAdmin: function(user) {
        const ssEmailAccount = config.gmailAccount;
        const subject = 'User signed up for a service';
        let bodyText = 'Hello Admin,\n';
        bodyText += user.name + ' with mobile no: ' + user.mobile + ' signed up for service ' + user.service + '\n';
        bodyText += 'User email: ' + user.email;

        const params = {
            from: ssEmailAccount.user,
            to: config.sureclaimAdminEmails,
            subject: subject,
            text: bodyText,
            html: '',
            attachments: []
        };

        this.sendEmail(ssEmailAccount, params, function failureCallback(params) {
            console.log('Service signed up mail not sent to: ' + params.to);
        }, function successCallback(params) {
            console.log('successfully sent service signed up mail to : ' + params.to);
        });
    },

    sendWelcomeMessage: function(user) {
        const exotelApi = config.exotelApi;
        const message = exotelApi.welcomeMessageTemplate.replace('%s', user.name);
        const dataString = 'From=' + exotelApi.exoPhone + '&To=' + user.mobile + '&Body=' + message + '&Priority=high';
        const url = exotelApi.smsUrl + '?' + dataString;

        request.post(url, function(err, response, body) {
            if (err) {
                console.log('Error occured while sending message: ', err);
            } else {
                if (response.statusCode == 200) {
                    console.log('successfully sent message to ' + user.mobile);
                } else {
                    console.log(body);
                }
            }
        });
    },

    sendOTP: function(user, failureCallback, successCallback) {
        const self = this;
        const exotelApi = config.exotelApi;
        const otp = this.generateOTP();
        const message = exotelApi.otpTemplate.replace('%d', otp);
        const dataString = 'From=' + exotelApi.exoPhone + '&To=' + user.mobile + '&Body=' + message + '&Priority=high';

        const url = exotelApi.smsUrl + '?' + dataString;

        request.post(url, function(err, response, body) {
            if (err) {
                failureCallback(err);
            } else {
                if (response.statusCode == 200) {

                    // save to redis DB
                    user.otp = otp;
                    self.setOTP(user, function failure(err) {
                        failureCallback(err);
                    }, function success(message) {
                        successCallback(message);
                    });
                } else {
                    failureCallback(body);
                }
            }
        });
    },

    verifyOTP: function(user, failureCallback, successCallback) {
        const key = user.otpKey;
        const enteredOtp = user.otp;

        redisApi.getKey(key, function failure(err) {
            failureCallback(err);
        }, function success(otp) {
            if (otp == enteredOtp) {
                successCallback(otp);
            } else {
                failureCallback('OTP Mismatch');
            }
        });
    },

    setOTP: function(user, failureCallback, successCallback) {
        const key = user.otpKey;
        const otp = user.otp;
        const expireTime = 60 * 3; // 3 minutes

        redisApi.setKeyWithExpire(key, otp, expireTime, function failure(err) {
            failureCallback(err);
        }, function success(reply) {
            successCallback(reply);
        });
    },

    isInt: function(value) {
        return !isNaN(value) 
                && (parseInt(Number(value)) == value) 
                && (!isNaN(parseInt(value, 10)));
    }

};