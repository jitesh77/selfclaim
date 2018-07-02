/**
 * @author Varun Kumar<varunon9@gmail.com>
 * https://github.com/varunon9
 */

'use strict';

// Delete receipt in Receipts Tab
function deleteReceiptButtonClicked(receiptId) {
    var currentReceipt = {
        selfClaimScid: _latestSelfClaim.scid,
        id: receiptId
    };

    if (currentReceipt.id) {
        globals.ajaxService.deleteReceipt(currentReceipt, function successCallback(result) {
            globals.showToastMessage('Success', 'Receipt successfully deleted', 'success');
            syncReceiptsFromServer();
        }, function failureCallback(message) {
            globals.showToastMessage('Error', message, 'error');
        });
    }
}

// Edit receipt in Receipts Tab
function editReceiptButtonClicked(receiptId) {
    $('#receiptsTabUpdateButton').css('display', 'block');
    $('#receiptsTabAddButton').css('display', 'none');

    // iterating over receipts array and finding clicked receipt based on id
    var receipt;
    for (var i = 0; i < _latestSelfClaim.receipts.length; i++) {
        if (_latestSelfClaim.receipts[i].id == receiptId) {
            receipt = _latestSelfClaim.receipts[i];
            break;
        }
    }

    $('#receiptFormSegment input[data-field="receiptDate"]').val(formatDate(receipt.date));
    $('#receiptFormSegment input[data-field="receiptNumber"]').val(receipt.number);
    $('#receiptFormSegment input[data-field="receiptAmount"]').val(receipt.amount);

    if (receipt.type) {
        $('#receiptFormSegment input[name="receiptType"]').removeAttr('checked');
    }
    $('#receiptFormSegment input[name="receiptType"][value="' + receipt.type + '"]')
            .attr('checked', 'checked').click();

    $('#receiptFormSegment input[data-field="receiptId"]').val(receipt.id);
}

function syncReceiptsFromServer() {
	globals.ajaxService.getReceipts({
	    selfClaimScid: _latestSelfClaim.scid
	}, function successCallback(result) {
	    _latestSelfClaim.receipts = result;
	    updateReceiptsTab(result);
	}, function failureCallback(message) {
	    globals.showToastMessage('Error', message, 'error');
	});
}


$(document).ready(function() {

	// cache DOM for Receipts Tab here
	var receiptFormSegmentDom = $('#receiptFormSegment');
	var totalNoOfReceiptsDom = $('#totalNoOfReceipts');
	var totalReceiptAmountDom = $('#totalReceiptAmount');
	var receiptsTabErrorMessage = $('#receiptsTabErrorMessage');

	$('#receiptsTabAddButton').on('click', function(e) {
	    e.preventDefault();
	    receiptsTabErrorMessage.empty();

	    // validations and increase progress level
	    var errorMessage = '';
	    var hasError = false;

	    if ($('#receiptFormSegment input[data-field="receiptDate"]').val() == '') {
	        errorMessage += '<p>Please enter receipt date.</p>';
	        hasError = true;
	    }

	    if ($('#receiptFormSegment input[data-field="receiptNumber"]').val() == '') {
	        errorMessage += '<p>Please enter receipt number.</p>';
	        hasError = true;
	    }

	    if ($('#receiptFormSegment input[data-field="receiptAmount"]').val() == '') {
	        errorMessage += '<p>Please enter receipt amount.</p>';
	        hasError = true;
	    }

	    if (!hasError) {
	        for (var i = 0; i < _latestSelfClaim.receipts.length; i++) {
	            var receipt = _latestSelfClaim.receipts[i];
	            if (receipt.date == '' || receipt.amount == '' || receipt.number == ''
	                    || !receipt.date || !receipt.number || !receipt.amount) {
	                hasError = true;
	                errorMessage = '<p>Errors found in other receipts. Please review all your receipts.</p>';
	                break;
	            }
	        }
	    }
	    
	    if (hasError) {
	        receiptsTabErrorMessage.append(errorMessage);
	    } else {
		    createOrUpdateCurrentReceipt();
		}
	});

	$('#receiptsTabUpdateButton').on('click', function(e) {
	    e.preventDefault();
	    receiptsTabErrorMessage.empty();
	    createOrUpdateCurrentReceipt();
	});

	$('#receiptsTabSaveAndMoveButton').on('click', function(e) {
	    e.preventDefault();
	    receiptsTabErrorMessage.empty();

	    // validations and increase progress level
	    var errorMessage = '';
	    var hasError = false;

	    // if no errors found in current receipt then check all other receipts
	    if (!hasError) {
	        for (var i = 0; i < _latestSelfClaim.receipts.length; i++) {
	            var receipt = _latestSelfClaim.receipts[i];
	            if (receipt.date == '' || receipt.amount == '' || receipt.number == ''
	                    || !receipt.date || !receipt.number || !receipt.amount) {
	                hasError = true;
	                errorMessage = '<p>Errors found in other receipts. Please review all your receipts.</p>';
	                break;
	            }
	        }
	    }

	    if (hasError) {
	        receiptsTabErrorMessage.append(errorMessage);
	    } else {
	        // increase the progressLevel and save info
	        _latestSelfClaim.progressLevel = 5;
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

	var createOrUpdateCurrentReceipt = function() {
	    var selfClaim = {};
	    selfClaim.scid = _latestSelfClaim.scid;
	    selfClaim.userSsid = _latestSelfClaim.userSsid;
	    selfClaim.progressLevel = _latestSelfClaim.progressLevel;

	    // save info to db
	    globals.ajaxService.saveSelfClaim(selfClaim, function successCallback(result) {

	        var currentReceipt = {
	            selfClaimScid: _latestSelfClaim.scid
	        };

	        currentReceipt.date = $('#receiptFormSegment input[data-field="receiptDate"]').val();
	        currentReceipt.number = $('#receiptFormSegment input[data-field="receiptNumber"]').val();
	        currentReceipt.amount = $('#receiptFormSegment input[data-field="receiptAmount"]').val();

	        currentReceipt.type = $('#receiptFormSegment input[name="receiptType"]:checked').val();
	        currentReceipt.id = $('#receiptFormSegment input[data-field="receiptId"]').val();

	        globals.ajaxService.createOrUpdateReceipt(currentReceipt, function successCallback(result) {

	            if (currentReceipt.id) {
	                globals.showToastMessage('Success', 'Receipt Updated', 'success');
	            } else {
	                globals.showToastMessage('Success', 'Receipt Created', 'success');
	            }

	            // updating receipts tab
	            syncReceiptsFromServer();


	        }, function failureCallback(message) {
	            globals.showToastMessage('Error', message, 'error');
	        });
	        

	    }, function failureCallback(message) {
	        globals.showToastMessage('Error', message, 'error');
	    });
	};
});