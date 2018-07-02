/**
 * @author Varun Kumar<varunon9@gmail.com>
 * https://github.com/varunon9
 */

'use-strict';

$(document).ready(function() {
    
    $('.ui.checkbox').checkbox();

    var errorMessageDom = $('#errorMessage');
    var loginPhoneErrorDom = $('#loginPhoneError');
    var loginOtpErrorDom = $('#loginOtpError');

    $('#resendOtpLink').on('click', function(e) {
        e.preventDefault();
    	errorMessageDom.empty();
        loginPhoneErrorDom.empty();
        loginOtpErrorDom.empty();

    	var params = {};
    	params.mobile = $('#mobile').val();

    	var hasError = false;
    	var errorMessage = '';
        var loginPhoneError = '';
        var loginOtpError = '';


    	if (params.mobile == '') {
    		hasError = true;
    		loginPhoneError += 'Please enter mobile no.'
    	}
    	if (params.mobile && params.mobile.length != 10) {
    		hasError = true;
    		loginPhoneError += 'Please enter 10 digits mobile no.';
    	}

    	if (hasError) {
    		errorMessageDom.append(errorMessage);
            loginPhoneErrorDom.append(loginPhoneError);
            loginOtpErrorDom.append(loginOtpError);
    	} else {
            e.target.text = 'Resend OTP';
            
            globals.ajaxService.sendOtpToUser(params, function successCallback(message) {
                globals.showToastMessage('Success', message, 'success');
            }, function errorCallback(message) {
                globals.showToastMessage('Error', message, 'error');
            });
    	}
    });

    $('#loginButton').on('click', function() {
    	errorMessageDom.empty();
        loginPhoneErrorDom.empty();
        loginOtpErrorDom.empty();

    	var params = {};
    	params.mobile = $('#mobile').val();
    	params.otp = $('#otp').val();
        params.keepMeLoggedIn = $('#keepMeLoggedInCheckbox').is(':checked');

    	var hasError = false;
    	var errorMessage = '';
        var loginPhoneError = '';
        var loginOtpError = '';

    	if (params.mobile == '') {
    		hasError = true;
    		loginPhoneError += 'Please enter mobile no'
    	}
    	if (params.mobile && params.mobile.length != 10) {
    		hasError = true;
    		loginPhoneError += 'Please enter 10 digits mobile no.';
    	}
    	if (params.otp == '') {
    		hasError = true;
    		loginOtpError += 'Please enter received OTP'
    	}

    	if (hasError) {
    		errorMessageDom.append(errorMessage);
            loginPhoneErrorDom.append(loginPhoneError);
            loginOtpErrorDom.append(loginOtpError);
    	} else {
            globals.ajaxService.verifyOtpForUser(params, function successCallback() {
                window.location.href = 'home';
            }, function errorCallback(message) {
                globals.showToastMessage('Error', message, 'error');
            });
    	}
    });

});