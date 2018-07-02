/**
 * @author Varun Kumar<varunon9@gmail.com>
 * https://github.com/varunon9
 */

'use-strict';

$(document).ready(function() {
   
    $('.ui.checkbox').checkbox();
    var params = {}; // parameters for signup

    $('#signupButton').on('click', function() {
    	$('#errorMessage').empty();
        $('#signupUserNameError').empty();
        $('#signupPhoneError').empty();
       
    	
    	params.name = $('#userName').val();
    	params.mobile = $('#userMobile').val();

    	var hasError = false;
    	var errorMessage = '';
        var signupPhoneError = '';
        var signupUserNameError = '';
        //var letters = /^[A-Za-z]+$/;

    	// validation
    	if (params.name == '') {
    		hasError = true;
    		signupUserNameError += 'Please enter your name';
    	}
        else if( params.name.length < 3 ) {
            hasError = true;
            signupUserNameError += 'Name must be atleast 3 characters';
        }
        else if(!/^[a-zA-Z. ]*$/g.test(params.name)){
            hasError = true;
            signupUserNameError += 'Enter alphabets only.';
        }

        /*if (params.email == '') {
            hasError = true;
            errorMessage += '<p>Please enter your email</p>';
        }*/

    	if (params.mobile == '') {
    		hasError = true;
    		signupPhoneError += 'Mobile no. is mandatory';
    	}

    	if (params.mobile && params.mobile.length != 10) {
    		hasError = true;
    		signupPhoneError += 'Please enter 10 digits mobile no.';
    	}

    	if (hasError) {
    		$('#errorMessage').append(errorMessage);
            $('#signupUserNameError').append(signupUserNameError);
            $('#signupPhoneError').append(signupPhoneError);
    	} else {
            $('#signupButton').addClass('loading');
            // send OTP
            globals.ajaxService.sendOtp(params, function successCallback() {
                
                // show enter OTP modal 
                $('#verifyOtpModal').modal('show');
            }, function errorCallback(message) {
                globals.showToastMessage('Error', message, 'error');
                $('#signupButton').removeClass('loading');
            })
    	}
    });

    $('#verifyOtpModal').modal({
        closable: false,

        onShow: function() {
            $('#otpInputText').val(''); // clear otp field
        },

        onApprove: function() {
            params.otp = $('#otpInputText').val();

            if (params.otp == '') {
                globals.showToastMessage('Error', 'Please Enter received OTP', 'error');
            } else {
                globals.ajaxService.signupUser(params, function successCallback() {
                    window.location.href = 'home';
                }, function errorCallback(message) {
                    globals.showToastMessage('Error', message, 'error');
                });
            }

            return false;
        },

        onDeny: function() {
            //return false;
        },

        onHide: function() {
            $('#signupButton').removeClass('loading');
        }
    });

});