/**
 * @author Varun Kumar<varunon9@gmail.com>
 * https://github.com/varunon9
 * Date: 11 April, 2018
 */

'use strict';

function  makeAjaxPostRequest(url, params, successCallback, failureCallback) {
    $.ajax({
        url: url,
        method: 'post',
        data: params,
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                // for some APIs we have message and not result
                // e.g. /user/send/otp -> {success: true, message: 'OTP sent'}
                if (response.message) {
                    successCallback(response.message);
                } else {
                    successCallback(response.result);
                }
            } else {
                failureCallback(response.message);
            }
        },
        error: globals.ajaxErrorHandler
    });
}

var globals = {}; // application wide global variable

globals.constants = {
	BANK_DETAILS_LOCAL_STORAGE_KEY: 'sureclaimBankDetails',
    SELF_CLAIM_DETAILS_LOCAL_STORAGE_KEY: 'selfClaimDetails'
}

globals.showToastMessage = function(heading, message, icon) {
    $.toast({
        heading: heading,
        text: message,
        showHideTransition: 'slide',
        icon: icon  // info, error, warning, success
    });
};

globals.ajaxErrorHandler = function(jqXHR, exception) {
    if (jqXHR.status === 0) {
        globals.showToastMessage('Error', 'Not connect.\n Verify Network.', 'error');
    } else if (jqXHR.status == 404) {
        globals.showToastMessage('Error', 'Requested page not found. [404]', 'error');
    } else if (jqXHR.status == 500) {
        globals.showToastMessage('Error', 'Internal Server Error [500].', 'error');
    } else if (exception === 'parsererror') {
        globals.showToastMessage('Error', 'Requested JSON parse failed.', 'error');
    } else if (exception === 'timeout') {
        globals.showToastMessage('Error', 'Time out error.', 'error');
    } else if (exception === 'abort') {
        globals.showToastMessage('Error', 'Ajax request aborted.', 'error');
    } else {
        globals.showToastMessage('Error', 'Uncaught Error.\n' + jqXHR.responseText, 'error');
    }
};

globals.ajaxService = {
    sendOtpToUser: function(params, successCallback, failureCallback) {
        var url = 'user/send/otp';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    verifyOtpForUser: function(params, successCallback, failureCallback) {
        var url = 'user/verify/otp';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    sendOtpToAdmin: function(params, successCallback, failureCallback) {
        var url = 'admin/send/otp';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    verifyOtpForAdmin: function(params, successCallback, failureCallback) {
        var url = 'admin/verify/otp';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    sendOtp: function(params, successCallback, failureCallback) {
        var url = 'send/otp';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    signupUser: function(params, successCallback, failureCallback) {
        var url = 'signup';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    getLatestSelfClaim: function(params, successCallback, failureCallback) {
        var url = 'dashboard/get/latestSelfClaim';
        if (globals.scid > 0) {
            url = 'dashboard/get/selfClaim/' + globals.scid;
        }
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    saveSelfClaim: function(params, successCallback, failureCallback) {
        var url = 'dashboard/save/selfClaim';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    saveUser: function(params, successCallback, failureCallback) {
        var url = 'dashboard/save/user';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    savePolicyHolder: function(params, successCallback, failureCallback) {
        var url = 'dashboard/save/policyHolder';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    updateAddress: function(params, successCallback, failureCallback) {
        var url = 'dashboard/update/address';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    createAddress: function(params, successCallback, failureCallback) {
        var url = 'dashboard/create/address';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    savePatient: function(params, successCallback, failureCallback) {
        var url = 'dashboard/save/patient';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    saveInsuranceInfo: function(params, successCallback, failureCallback) {
        var url = 'dashboard/save/insuranceInfo';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    saveHospitalInfo: function(params, successCallback, failureCallback) {
        var url = 'dashboard/save/hospitalInfo';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    saveCommunicationInfo: function(params, successCallback, failureCallback) {
        var url = 'dashboard/save/communicationInfo';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    getInsurers: function(params, successCallback, failureCallback) {
        var url = 'get/insurers';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    getTpas: function(params, successCallback, failureCallback) {
        var url = 'get/tpas';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    saveTreatmentInfo: function(params, successCallback, failureCallback) {
        var url = 'dashboard/save/treatmentInfo';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    createOrUpdateBill: function(params, successCallback, failureCallback) {
        var url = 'dashboard/createOrUpdate/bill';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    deleteBill: function(params, successCallback, failureCallback) {
        var url = 'dashboard/delete/bill';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    getBills: function(params, successCallback, failureCallback) {
        var url = 'dashboard/get/bills';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    createOrUpdateReceipt: function(params, successCallback, failureCallback) {
        var url = 'dashboard/createOrUpdate/receipt';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    deleteReceipt: function(params, successCallback, failureCallback) {
        var url = 'dashboard/delete/receipt';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    getReceipts: function(params, successCallback, failureCallback) {
        var url = 'dashboard/get/receipts';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    getUsers: function(params, successCallback, failureCallback) {
        var url = 'admin/get/users';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    getSelfClaims: function(params, successCallback, failureCallback) {
        var url = 'admin/get/selfClaims';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    addNewService: function(params, successCallback, failureCallback) {
        var url = 'admin/add/service';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    getAdminServices: function(params, successCallback, failureCallback) {
        var url = 'admin/get/services';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    getAdminProfile: function(params, successCallback, failureCallback) {
        var url = 'admin/get/profile';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    getUserClaims: function(params, successCallback, failureCallback) {
        var url = 'home/get/userClaims';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    getUserClaimData: function(params, successCallback, failureCallback) {
        var url = 'home/get/userClaimData';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    createNewSelfClaim: function(params, successCallback, failureCallback) {
        var url = 'home/create/selfClaim';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    getUserServices: function(params, successCallback, failureCallback) {
        var url = 'home/get/userServices';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    getUserProfile: function(params, successCallback, failureCallback) {
        var url = 'home/get/userProfile';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    saveUserProfile: function(params, successCallback, failureCallback) {
        var url = 'home/save/saveUserProfile';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },
    getAllProformas: function(params, successCallback, failureCallback) {
        var url = 'admin/get/allProformas';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    deleteProforma: function(params, successCallback, failureCallback) {
        var url = 'admin/delete/proforma';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    searchProformaDateWise: function(params, successCallback, failureCallback) {
        var url = 'admin/search/proformaDateWise';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    searchProformaByMobile: function(params, successCallback, failureCallback) {
        var url = 'admin/search/proformaByMobile';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    searchProformaByPatient: function(params, successCallback, failureCallback) {
        var url = 'admin/search/proformaByPatient';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    getAllServices: function(params, successCallback, failureCallback) {
        var url = 'admin/get/allServices';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    deleteService: function(params, successCallback, failureCallback) {
        var url = 'admin/delete/service';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    searchProformaUser: function(params, successCallback, failureCallback) {
        var url = 'admin/search/proformaUser';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    addUser: function(params, successCallback, failureCallback) {
        var url = 'admin/add/user';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    getUserSsid: function(params, successCallback, failureCallback) {
        var url = 'admin/get/userSsid';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    createNewProforma: function(params, successCallback, failureCallback) {
        var url = 'admin/create/proforma';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    addProformaService: function(params, successCallback, failureCallback) {
        var url = 'admin/add/proformaService';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    checkProformaService: function(params, successCallback, failureCallback) {
        var url = 'admin/check/proformaService';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    displayProformaServices: function(params, successCallback, failureCallback) {
        var url = 'admin/display/proformaService';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    deleteProformaService: function(params, successCallback, failureCallback) {
        var url = 'admin/delete/proformaService';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    addProformaPayment: function(params, successCallback, failureCallback) {
        var url = 'admin/add/proformaPayment';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    getProformaPayments: function(params, successCallback, failureCallback) {
        var url = 'admin/get/proformaPayments';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    deleteProformaPayment: function(params, successCallback, failureCallback) {
        var url = 'admin/delete/proformaPayment';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    saveProforma: function(params, successCallback, failureCallback) {
        var url = 'admin/save/proforma';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    addClaimCalculatorUser: function(params, successCallback, failureCallback) {
        var url = 'add/claimCalculatorUser';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    addClaimCalculatorBill: function(params, successCallback, failureCallback) {
        var url = 'add/claimCalculatorBill';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    updateClaimCalculatorBill: function(params, successCallback, failureCallback) {
        var url = 'update/claimCalculatorBill';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    deleteClaimCalculatorBill: function(params, successCallback, failureCallback) {
        var url = 'delete/claimCalculatorBill';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    },

    showClaimCalculatorBills: function(params, successCallback, failureCallback) {
        var url = 'show/claimCalculatorBills';
        makeAjaxPostRequest(url, params, successCallback, failureCallback);
    }
};

globals.localStorageService = {
	hasStorage: function() {
		try {
	        localStorage.setItem('testing', 'sureclaim');
	        localStorage.removeItem('testing');
	        return true;
	    } catch (exception) {
	        return false;
	    }
	},

	getItem: function(key) {
		if (this.hasStorage()) {
	        var jsonString = localStorage.getItem(key);
	        try {
	            var json = JSON.parse(jsonString);
	        } catch (exception) {
	            return jsonString;
	        }
	        return json;
	    }
	    return;
	},

	setItem: function(key, object) {
		if (this.hasStorage()) {
	        if (typeof object == 'object') {
	            var jsonString = JSON.stringify(object);
	            localStorage.setItem(key, jsonString);
	        } else {
	            localStorage.setItem(key, object);
	        }
	    }
	},

	deleteItem: function(key) {
		localStorage.removeItem(key);
	},

	updateItem: function(key, object) {
		if (this.hasStorage()) {
	        var jsonString = localStorage.getItem(key);
	        var jsonObject = JSON.parse(jsonString);

	        Object.keys(updatedObject).forEach(function (jsonKey) {
	            jsonObject[jsonKey] = updatedObject[jsonKey];
	        });
	        
	        localStorage.setItem(key, JSON.stringify(jsonObject));
	    }
	}
};