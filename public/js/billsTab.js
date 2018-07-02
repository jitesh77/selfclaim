/**
 * @author Varun Kumar<varunon9@gmail.com>
 * https://github.com/varunon9
 */

'use strict';

// Delete bill from bill table in Bills Tab  
function deleteBillButtonClicked(billId) {
    var currentBill = {
        selfClaimScid: _latestSelfClaim.scid,
        id: billId
    };
    if (currentBill.id) {
        globals.ajaxService.deleteBill(currentBill, function successCallback(result) {
            globals.showToastMessage('Success', 'Bill successfully deleted', 'success');
            syncBillsFromServer();
        }, function failureCallback(message) {
            globals.showToastMessage('Error', message, 'error');
        });
    }
}

// Edit bill in Bills Tab
function editBillButtonClicked(billId) {
    $('#billsTabUpdateButton').css('display', 'block');
    $('#billsTabAddButton').css('display', 'none');

    // iterating over bills array and finding clicked bill based on id
    var bill;
    for (var i = 0; i < _latestSelfClaim.bills.length; i++) {
        if (_latestSelfClaim.bills[i].id == billId) {
            bill = _latestSelfClaim.bills[i];
            break;
        }
    }
    showSelectedBill(bill);
}

// show bill (filled in form) to user
function showSelectedBill(bill) {
    if (bill) {
        $('#billsTabFormSegment input[data-field="billDate"]').val(formatDate(bill.date));
        $('#billsTabFormSegment input[data-field="billNumber"]').val(bill.number);
        $('#billsTabFormSegment input[data-field="billAmount"]').val(bill.amount);
        $('#billsTabFormSegment input[data-field="issuedBy"]').val(bill.issuedBy);

        if (bill.type) {
            $('#billsTabFormSegment input[name="billType"]').removeAttr('checked');
        }
        $('#billsTabFormSegment input[name="billType"][value="' + bill.type + '"]')
                .attr('checked', 'checked').click();

        $('#billServices input[type="checkbox"]').removeAttr('checked');

        if (bill.type == 'others') {
            $('#billServices').removeClass('hidden');
            if (bill.isConsultation) {
                $('#billServices input[data-field="isConsultation"]').attr('checked', 'checked');
            }
            if (bill.isBloodBank) {
                $('#billServices input[data-field="isBloodBank"]').attr('checked', 'checked');
            }
            if (bill.isLabOrDiagnostics) {
                $('#billServices input[data-field="isLabOrDiagnostics"]').attr('checked', 'checked');
            }
            if (bill.isOtherServices) {
                $('#billServices input[data-field="isOtherServices"]').attr('checked', 'checked');
            }
        } else {
            $('#billServices').addClass('hidden');
        }

        $('#billsTabFormSegment input[data-field="billId"]').val(bill.id);
    }
}

function syncBillsFromServer() {
	globals.ajaxService.getBills({
	    selfClaimScid: _latestSelfClaim.scid
	}, function successCallback(result) {
	    _latestSelfClaim.bills = result;
	    updateBillsTab(result);
	}, function failureCallback(message) {
	    globals.showToastMessage('Error', message, 'error');
	});
}


$(document).ready(function() {

	// cache DOM for Bills Tab here
	var billsTabFormSegmentDom = $('#billsTabFormSegment');
	var totalNoOfBillsDom = $('#totalNoOfBills');
	var totalBillAmountDom = $('#totalBillAmount');
	var billsTabErrorMessage = $('#billsTabErrorMessage');

	$('#billsTabFormSegment input[name="billType"]').on('change', function(e) {
	    var billType = $(this).val();
	    if (billType == 'others') {
	        $('#billServices').removeClass('hidden');
	    } else {
	        $('#billServices').addClass('hidden');
	    }
	});

	$('#billsTabAddButton').on('click', function(e) {
	    e.preventDefault();
	    billsTabErrorMessage.empty();
	    var errorMessage = '';
	    var hasError = false;

	    if ($('#billsTabFormSegment input[data-field="billDate"]').val() == '') {
	        errorMessage += '<p>Please enter bill date.</p>';
	        hasError = true;
	    }

	    if ($('#billsTabFormSegment input[data-field="billAmount"]').val() == '') {
	        errorMessage += '<p>Please enter bill amount.</p>';
	        hasError = true;
	    }

	    // if no errors found in current bill then check all other bills
	    if (!hasError) {
	        for (var i = 0; i < _latestSelfClaim.bills.length; i++) {
	            var bill = _latestSelfClaim.bills[i];
	            if (bill.date == '' || bill.amount == '' || bill.number == ''
	                    || !bill.date || !bill.number || !bill.amount) {
	                hasError = true;
	                errorMessage = '<p>Errors found in other bills. Please review all your bills.</p>';
	                break;
	            }
	        }
	    }

	    if (hasError) {
	        billsTabErrorMessage.append(errorMessage);
	    } else {
	        createOrUpdateCurrentBill();
	    }
	});

	$('#billsTabUpdateButton').on('click', function(e) {
	    e.preventDefault();
	    billsTabErrorMessage.empty();
	    createOrUpdateCurrentBill();
	});

	$('#billsTabSaveAndMoveButton').on('click', function(e) {
	    billsTabErrorMessage.empty();
	    var errorMessage = '';
	    var hasError = false;
	    var totalBills =  _latestSelfClaim.bills.length;

	    if (totalBills == 0) {
	    	errorMessage = '<p>Please enter bill details to proceed.</p>';
	    	hasError = true;
	    }

	    if (hasError) {
	        billsTabErrorMessage.append(errorMessage);
	    } else {
	        // increase the progressLevel and save info
	        _latestSelfClaim.progressLevel = 4;
	        setActiveTab(_latestSelfClaim.progressLevel);
	        updateProgressSteps(_latestSelfClaim.progressLevel);

	        var selfClaim = {};
	        selfClaim.scid = _latestSelfClaim.scid;
	        selfClaim.userSsid = _latestSelfClaim.userSsid;
	        selfClaim.progressLevel = _latestSelfClaim.progressLevel;

	        globals.ajaxService.saveSelfClaim(selfClaim, function successCallback(result) {
	        	globals.showToastMessage('Success', 'All data saved', 'success');
        	}, function failureCallback(message) {
        	    globals.showToastMessage('Error', message, 'error');
        	});
	    }
	});

	var createOrUpdateCurrentBill = function() {
	    var selfClaim = {};
	    selfClaim.scid = _latestSelfClaim.scid;
	    selfClaim.userSsid = _latestSelfClaim.userSsid;
	    selfClaim.progressLevel = _latestSelfClaim.progressLevel;

	    // save info to db
	    globals.ajaxService.saveSelfClaim(selfClaim, function successCallback(result) {

	        var currentBill = {
	            isConsultation: false,
	            isBloodBank: false,
	            isLabOrDiagnostics: false,
	            isOtherServices: false,
	            selfClaimScid: _latestSelfClaim.scid
	        };

	        currentBill.date = $('#billsTabFormSegment input[data-field="billDate"]').val();
	        currentBill.number = $('#billsTabFormSegment input[data-field="billNumber"]').val();
	        currentBill.amount = $('#billsTabFormSegment input[data-field="billAmount"]').val();
	        currentBill.issuedBy = $('#billsTabFormSegment input[data-field="issuedBy"]').val();

	        currentBill.type = $('#billsTabFormSegment input[name="billType"]:checked').val();

	        if (currentBill.type == 'others') {
	            currentBill.isConsultation = 
	                    $('#billServices input[data-field="isConsultation"]').is(':checked');
	            currentBill.isBloodBank = 
	                    $('#billServices input[data-field="isBloodBank"]').is(':checked');
	            currentBill.isLabOrDiagnostics = 
	                    $('#billServices input[data-field="isLabOrDiagnostics"]').is(':checked');
	            currentBill.isOtherServices = 
	                    $('#billServices input[data-field="isOtherServices"]').is(':checked');
	        } 

	        currentBill.id = $('#billsTabFormSegment input[data-field="billId"]').val();

	        globals.ajaxService.createOrUpdateBill(currentBill, function successCallback(result) {

	            if (currentBill.id) {
	                globals.showToastMessage('Success', 'Bill Updated', 'success');
	            } else {
	                globals.showToastMessage('Success', 'Bill Created', 'success');
	            } 

	            // updating bills tab
	            syncBillsFromServer();


	        }, function failureCallback(message) {
	            globals.showToastMessage('Error', message, 'error');
	        });
	        

	    }, function failureCallback(message) {
	        globals.showToastMessage('Error', message, 'error');
	    });
	};
});