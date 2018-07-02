/**
 * @author Varun Kumar<varunon9@gmail.com>
 * https://github.com/varunon9
 */

'use strict';

/**
 * A utility function to convert date to suitable format needed to update input[type="date"]
 */
function formatDate(date) {
    if (date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
        if (month.length < 2) {
            month = '0' + month;
        }
        if (day.length < 2) {
            day = '0' + day;
        }
        return [year, month, day].join('-');
    } else {
        return '';
    }
}

/**
 * Populate select options of insurers, tpas, states 
 * and make first option selected in jQuery
 */
function init() {

    // make first option selected (in jQuery) in all select fields
    $('#insuranceTabForm select[data-field="patientOccupation"]')
            .val($('#insuranceTabForm select[data-field="patientOccupation"] option:first').val());
    $('#insuranceTabForm select[data-field="patientRelationshipWithPolicyHolder"]')
            .val($('#insuranceTabForm select[data-field="patientRelationshipWithPolicyHolder"] option:first').val());
    $('#treatmentTabForm select[data-field="reasonForHospitalization"]')
            .val($('#treatmentTabForm select[data-field="reasonForHospitalization"] option:first').val());
    $('#treatmentTabForm select[data-field="typeOfDelivery"]')
            .val($('#treatmentTabForm select[data-field="typeOfDelivery"] option:first').val());
}

// global variables
var _latestSelfClaim;
var _progressStepsDom;

// global functions
function setActiveTab(progressLevel) {
	var activeTab = 'insurance';
	switch (progressLevel) {
		case 1: {
			activeTab = 'insurance';
			break;
		}
		case 2: {
			activeTab = 'treatment';
			break;
		}
		case 3: {
			activeTab = 'bills';
			break;
		}
		case 4: {
			activeTab = 'receipts';
			break;
		}
		case 5: {
			activeTab = 'checklist';
			break;
		}
		/*case 6: {
			activeTab = 'documents';
			break;
		}*/
	}

	$.tab('change tab', activeTab);
}

function updateProgressSteps(progressLevel) {
	var maxStepNo = 6;

	// remove active class to current step
	_progressStepsDom.children('a.active').removeClass('active');
	_progressStepsDom.children('a.disabled').removeClass('disabled');
	_progressStepsDom.children('a.completed').removeClass('completed');

	// add completed class to previous steps from current progressLevel
	for (var i = 1; i < progressLevel; i++) {
		_progressStepsDom.children('a:nth-child(' + i + ')').addClass('completed');
	}

	// add active class to current progressLevel step
	_progressStepsDom.children('a:nth-child(' + progressLevel + ')').addClass('active');

	// add disabled class to next steps from current progressLevel
	for (var i = progressLevel + 1; i <= maxStepNo; i++) {
		_progressStepsDom.children('a:nth-child(' + i + ')').addClass('disabled');
	}
}

function updateInsuranceTab(selfClaim) {
    $('#insuranceTabForm input[data-field="patientName"]').val(selfClaim.patient.name);

    if (selfClaim.hospitalInfo) {
    	$('#insuranceTabForm input[data-field="hospitalName"]').val(selfClaim.hospitalInfo.name);
    	$('#insuranceTabForm input[data-field="hospitalCity"]').val(selfClaim.hospitalInfo.city);
    	
        $('#insuranceTabForm input[data-field="hospitalState"]')
            .val(selfClaim.hospitalInfo.state);

    	$('#insuranceTabForm input[data-field="dateOfAdmission"]')
    	        .val(formatDate(selfClaim.hospitalInfo.dateOfAdmission));
    	$('#insuranceTabForm input[data-field="dateOfDischarge"]')
    	        .val(formatDate(selfClaim.hospitalInfo.dateOfDischarge));
    }

    $('#insuranceTabForm input[data-field="patientDob"]')
            .val(formatDate(selfClaim.patient.dob));

    $('#insuranceTabForm input[name="patientGender"]').removeAttr('checked');
    $('#insuranceTabForm input[name="patientGender"][value="' + selfClaim.patient.gender + '"]')
            .attr('checked', 'checked').click();

    if (selfClaim.patient.occupation) {
        $('#insuranceTabForm select[data-field="patientOccupation"]')
                .val(selfClaim.patient.occupation)
                .change();
    }

    if (selfClaim.communicationInfo.address) {
        $('#insuranceTabForm input[data-field="communicationInfoAddressId"]')
                .val(selfClaim.communicationInfo.addressId);

    	$('#insuranceTabForm input[data-field="communicationAddressLine1"]')
    	        .val(selfClaim.communicationInfo.address.line1);
    	$('#insuranceTabForm input[data-field="communicationAddressLine2"]')
    	        .val(selfClaim.communicationInfo.address.line2);
    	$('#insuranceTabForm input[data-field="communicationAddressCity"]')
    	        .val(selfClaim.communicationInfo.address.city);
    	$('#insuranceTabForm input[data-field="communicationAddressState"]')
    	        .val(selfClaim.communicationInfo.address.state);
    	$('#insuranceTabForm input[data-field="communicationAddressPin"]')
    	        .val(selfClaim.communicationInfo.address.pin);
        $('#insuranceTabForm input[data-field="communicationAddressPhone"]')
                .val(selfClaim.communicationInfo.mobile);
        $('#insuranceTabForm input[data-field="communicationAddressEmail"]')
                .val(selfClaim.communicationInfo.email);
    }

    $('#insuranceTabForm input[data-field="corporateName"]')
        .val(selfClaim.insuranceInfo.corporateName);
    $('#insuranceTabForm input[data-field="employeeId"]')
        .val(selfClaim.insuranceInfo.employeeId);

    $('#insuranceTabForm input[name="isPatientAlsoPolicyHolder"]').removeAttr('checked');
    if (selfClaim.isPatientAlsoPolicyHolder) {
    	$('#insuranceTabForm input[name="isPatientAlsoPolicyHolder"][value="yes"]')
    	        .attr('checked', 'checked').click();
    } else {
    	$('#insuranceTabForm input[name="isPatientAlsoPolicyHolder"][value="no"]')
    	        .attr('checked', 'checked').click();
    }

    if (!selfClaim.isPatientAlsoPolicyHolder) {
        $('#insuranceTabForm input[data-field="policyHolderName"]')
            .val(selfClaim.policyHolder.name);
        $('#insuranceTabForm select[data-field="patientRelationshipWithPolicyHolder"]')
            .val(selfClaim.patientRelationshipWithPolicyHolder)
            .change();
    } else {
        $('#insuranceTabForm input[name="isPatientAlsoPolicyHolder"][value="yes"]')
            .attr('checked', 'checked');
        $('#policyHolderInfoSegment').addClass('hidden');
    }

    if (selfClaim.insuranceInfo.insurerId) {
        $('#insuranceTabForm input[data-field="insurerId"]')
            .val(selfClaim.insuranceInfo.insurer.name);
    }

    if (selfClaim.insuranceInfo.tpaId) {
        $('#insuranceTabForm input[data-field="tpaId"]')
            .val(selfClaim.insuranceInfo.tpa.name);
    }

    $('#insuranceTabForm input[data-field="policyNumber"]')
        .val(selfClaim.insuranceInfo.policyNumber);
    $('#insuranceTabForm input[data-field="insurerCustomerId"]')
        .val(selfClaim.insuranceInfo.insurerCustomerId);
    $('#insuranceTabForm input[data-field="tpaCustomerId"]')
        .val(selfClaim.insuranceInfo.tpaCustomerId);
    
}

function updateTreatmentTab(selfClaim) {
    var treatmentInfo = selfClaim.treatmentInfo;

    if (treatmentInfo.reasonForHospitalization) {
        $('#treatmentTabForm select[data-field="reasonForHospitalization"]')
                .val(treatmentInfo.reasonForHospitalization)
                .change();
    }

    $('#treatmentTabForm input[data-field="treatmentName"]')
            .val(treatmentInfo.treatmentName);

    if (treatmentInfo.typeOfDelivery) {
        $('#treatmentTabForm select[data-field="typeOfDelivery"]')
                .val(treatmentInfo.typeOfDelivery)
                .change();
    }

    if (treatmentInfo.dateOfDelivery) {
        $('#treatmentTabForm input[data-field="dateOfDelivery"]')
                .val(formatDate(treatmentInfo.dateOfDelivery));
    }
    if (treatmentInfo.diseaseFirstDetectedDate) {
        $('#treatmentTabForm input[data-field="diseaseFirstDetectedDate"]')
                .val(formatDate(treatmentInfo.diseaseFirstDetectedDate));
    }
    if (treatmentInfo.dateOfInjury) {
        $('#treatmentTabForm input[data-field="dateOfInjury"]')
                .val(formatDate(treatmentInfo.dateOfInjury));
    }
    
    if (treatmentInfo.causeOfInjury) {
        $('#treatmentTabForm input[name="causeOfInjury"]').removeAttr('checked');
    }
    $('#treatmentTabForm input[name="causeOfInjury"][value="' + treatmentInfo.causeOfInjury + '"]')
            .attr('checked', 'checked');

    if (treatmentInfo.isCaseMedicoLegal) {
        $('#treatmentTabForm input[name="isCaseMedicoLegal"]').removeAttr('checked');
        $('#treatmentTabForm input[name="isCaseMedicoLegal"][value="yes"]')
                .attr('checked', 'checked');
    } else {
        $('#treatmentTabForm input[name="isCaseMedicoLegal"]').removeAttr('checked');
        $('#treatmentTabForm input[name="isCaseMedicoLegal"][value="no"]')
                .attr('checked', 'checked');
    }

    if (treatmentInfo.wasCaseReportedToPolice) {
        $('#treatmentTabForm input[name="wasCaseReportedToPolice"]').removeAttr('checked');
        $('#treatmentTabForm input[name="wasCaseReportedToPolice"][value="yes"]')
                .attr('checked', 'checked');
    } else {
        $('#treatmentTabForm input[name="wasCaseReportedToPolice"]').removeAttr('checked');
        $('#treatmentTabForm input[name="wasCaseReportedToPolice"][value="no"]')
                .attr('checked', 'checked');
    }

    if (treatmentInfo.roomCategory) {
        $('#treatmentTabForm input[name="roomCategory"]').removeAttr('checked');
    }
    $('#treatmentTabForm input[name="roomCategory"][value="' + treatmentInfo.roomCategory + '"]')
            .attr('checked', 'checked');
}


function updateBillsTab(billsArray) {
    // updating no of bills
    $('#totalNoOfBills').text(billsArray.length);

    // updating total bill amount
    var totalBillAmount = 0;
    billsArray.forEach(function(bill) {
        totalBillAmount += bill.amount;
    });
    $('#totalBillAmount').text(totalBillAmount);

    $('#billsTableReceiptsTab tbody').empty();
    var i = 0;

    billsArray.forEach(function(bill) {
        var sNo = i+1;
        var row = '<tr>';
        row += '<td>' + sNo + '</td>';
        row += '<td>' + new Date(bill.date).toDateString() + '</td>';
        row += '<td>' + bill.number + '</td>';
        row += '<td>' + bill.amount + '</td>';
        row += '<td>' + bill.issuedBy + '</td>';
        row += '<td>' + bill.type + '</td>';
        row += '<td><i class="pencil alternate icon edit-button" title="Edit"'
                + 'onClick="editBillButtonClicked(' + bill.id + ');"></i></td>';
        row += '<td><i class="trash alternate outline icon delete-button" title="Delete"' 
                + 'onClick="deleteBillButtonClicked(' + bill.id + ');"></i></td>'; 
        row += '</tr>';

        $('#billsTableReceiptsTab tbody').append(row);
        i++;
    });

    // emptying current bill form so that user can add new
    $('#billsTabFormSegment input[data-field="billDate"]').val('');
    $('#billsTabFormSegment input[data-field="billNumber"]').val('');
    $('#billsTabFormSegment input[data-field="billAmount"]').val('');
    $('#billsTabFormSegment input[data-field="issuedBy"]').val('');

    $('#billServices input[type="checkbox"]').removeAttr('checked');

    $('#billsTabFormSegment input[data-field="billId"]').val('');

    $('#billsTabUpdateButton').css('display', 'none');
    $('#billsTabAddButton').css('display', 'block');
}

function updateReceiptsTab(receiptsArray) {
    // updating no of receipts
    $('#totalNoOfReceipts').text(receiptsArray.length);

    // updating total receipt amount
    var totalReceiptAmount = 0;
    receiptsArray.forEach(function(receipt) {
        totalReceiptAmount += receipt.amount;
    });
    $('#totalReceiptAmount').text(totalReceiptAmount);
    
    // populating table
    $('#receiptsTableReceiptsTab tbody').empty();
    var i = 0;

    receiptsArray.forEach(function(receipt) {            
        var sNo = i + 1;
        var row = '<tr>';
        row += '<td>' + sNo + '</td>';
        row += '<td>' + new Date(receipt.date).toDateString() + '</td>';
        row += '<td>' + receipt.number + '</td>';
        row += '<td>' + receipt.amount + '</td>';
        row += '<td>' + receipt.type + '</td>';
        row += '<td><i class="pencil alternate icon edit-button" title="Edit"'
                + 'onClick="editReceiptButtonClicked(' + receipt.id + ');"></i></td>';
        row += '<td><i class="trash alternate outline icon delete-button" title="Delete"'
                + 'onClick="deleteReceiptButtonClicked(' + receipt.id + ');"></i></td>'; 
        row += '</tr>';

        $('#receiptsTableReceiptsTab tbody').append(row);
        i++;
    });

    // emptying receipt form fields
    $('#receiptFormSegment input[data-field="receiptDate"]').val('');
    $('#receiptFormSegment input[data-field="receiptNumber"]').val('');
    $('#receiptFormSegment input[data-field="receiptAmount"]').val('');
    $('#receiptFormSegment input[data-field="receiptId"]').val('');

    $('#receiptsTabUpdateButton').css('display', 'none');
    $('#receiptsTabAddButton').css('display', 'block');
}

function updateChecklistTab(selfClaim) {
    if (selfClaim.progressLevel >= 5) {
        // updating insuranceInfoChecklist
        $('#insuranceInfoChecklistSegment span[data-field="patientNameChecklist"]')
                .text(selfClaim.patient.name);

        $('#insuranceInfoChecklistSegment span[data-field="hospitalNameChecklist"]')
                .text(selfClaim.hospitalInfo.name);
        $('#insuranceInfoChecklistSegment span[data-field="hospitalCityChecklist"]')
                .text(selfClaim.hospitalInfo.city);
        
        $('#insuranceInfoChecklistSegment span[data-field="hospitalStateChecklist"]')
                .text(selfClaim.hospitalInfo.state);

        $('#insuranceInfoChecklistSegment span[data-field="dateOfAdmissionChecklist"]')
                .text(new Date(selfClaim.hospitalInfo.dateOfAdmission).toDateString());
        $('#insuranceInfoChecklistSegment span[data-field="dateOfDischargeChecklist"]')
                .text(new Date(selfClaim.hospitalInfo.dateOfDischarge).toDateString());

        $('#insuranceInfoChecklistSegment span[data-field="patientDobChecklist"]')
                .text(new Date(selfClaim.patient.dob).toDateString());

        $('#insuranceInfoChecklistSegment span[data-field="patientGenderChecklist"]')
                .text(selfClaim.patient.gender);

        $('#insuranceInfoChecklistSegment span[data-field="patientOccupationChecklist"]')
                .text(selfClaim.patient.occupation);

        var communicationAddress = selfClaim.communicationInfo.address.line1 + ', ' +
                selfClaim.communicationInfo.address.line2 + ', ' +
                selfClaim.communicationInfo.address.city + ', ' +
                selfClaim.communicationInfo.address.state + ', ' +
                selfClaim.communicationInfo.address.pin;

        $('#insuranceInfoChecklistSegment span[data-field="communicationAddressChecklist"]')
                .text(communicationAddress);
        $('#insuranceInfoChecklistSegment span[data-field="communicationPhoneChecklist"]')
                .text(selfClaim.communicationInfo.mobile);
        $('#insuranceInfoChecklistSegment span[data-field="communicationEmailChecklist"]')
                .text(selfClaim.communicationInfo.email);

        $('#insuranceInfoChecklistSegment span[data-field="corporateNameChecklist"]')
            .text(selfClaim.insuranceInfo.corporateName);
        $('#insuranceInfoChecklistSegment span[data-field="employeeIdChecklist"]')
            .text(selfClaim.insuranceInfo.employeeId);

        $('#insuranceInfoChecklistSegment span[data-field="policyHolderNameChecklist"]')
                .text(selfClaim.policyHolder.name);
        $('#insuranceInfoChecklistSegment span[data-field="policyHolderRelationshipChecklist"]')
                .text(selfClaim.patientRelationshipWithPolicyHolder);

        $('#insuranceInfoChecklistSegment span[data-field="insuranceProviderChecklist"]')
                .text(selfClaim.insuranceInfo.insurer.name);

        if (selfClaim.insuranceInfo.tpa) {
            $('#insuranceInfoChecklistSegment span[data-field="tpaChecklist"]')
                    .text(selfClaim.insuranceInfo.tpa.name);
        } else {
            $('#insuranceInfoChecklistSegment span[data-field="tpaChecklist"]')
                    .text('');
        }

        $('#insuranceInfoChecklistSegment span[data-field="policyNumberChecklist"]')
                .text(selfClaim.insuranceInfo.policyNumber);
        $('#insuranceInfoChecklistSegment span[data-field="insurerCustomerIdChecklist"]')
                .text(selfClaim.insuranceInfo.insurerCustomerId);
        $('#insuranceInfoChecklistSegment span[data-field="tpaCustomerIDChecklist"]')
                .text(selfClaim.insuranceInfo.tpaCustomerId);


        // updating treatmentInfoChecklist
        $('#treatmentInfoChecklistSegment span[data-field="hospitalizationReasonChecklist"]')
                .text(selfClaim.treatmentInfo.reasonForHospitalization);

        $('#treatmentInfoChecklistSegment span[data-field="treatmentNameChecklist"]')
                .text(selfClaim.treatmentInfo.treatmentName);

        $('#treatmentInfoChecklistSegment span[data-field="typeOfDeliveryChecklist"]')
                .text(selfClaim.treatmentInfo.typeOfDelivery);

        if (selfClaim.treatmentInfo.dateOfDelivery) {
            $('#treatmentInfoChecklistSegment span[data-field="dateOfDeliveryChecklist"]')
                    .text(new Date(selfClaim.treatmentInfo.dateOfDelivery).toDateString());
        }

        if (selfClaim.treatmentInfo.diseaseFirstDetectedDate) {
            $('#treatmentInfoChecklistSegment span[data-field="diseaseFirstDetectedDateChecklist"]')
                    .text(new Date(selfClaim.treatmentInfo.diseaseFirstDetectedDate).toDateString());
        }

        if (selfClaim.treatmentInfo.dateOfInjury) {
            $('#treatmentInfoChecklistSegment span[data-field="dateOfInjuryChecklist"]')
                    .text(new Date(selfClaim.treatmentInfo.dateOfInjury).toDateString());
        }

        $('#treatmentInfoChecklistSegment span[data-field="causeOfInjuryChecklist"]')
                .text(selfClaim.treatmentInfo.causeOfInjury);

        $('#treatmentInfoChecklistSegment span[data-field="isCaseMedicoLegalChecklist"]')
                .text(selfClaim.treatmentInfo.isCaseMedicoLegal ? 'Yes' : 'No');

        $('#treatmentInfoChecklistSegment span[data-field="wasReportedToPoliceChecklist"]')
                .text(selfClaim.treatmentInfo.wasCaseReportedToPolice ? 'Yes' : 'No');

        $('#treatmentInfoChecklistSegment span[data-field="roomCategoryChecklist"]')
                .text(selfClaim.treatmentInfo.roomCategory);


        // updating billsTableChecklist
        $('#billsTableCheklistTab tbody').empty();
        var j = 1;

        selfClaim.bills.forEach(function(bill) {
            var row = '<tr>';
            row += '<td>' + j + '</td>';
            row += '<td>' + new Date(bill.date).toDateString() + '</td>';
            row += '<td>' + bill.number + '</td>';
            row += '<td>' + bill.amount + '</td>';
            row += '<td>' + bill.issuedBy + '</td>';
            row += '<td>' + bill.type + '</td>';
            row += '</tr>';
            j++;

            $('#billsTableCheklistTab tbody').append(row);
        });

        // updating receiptsTableChecklist
        $('#receiptsTableChecklistTab tbody').empty();
        var i = 1;

        selfClaim.receipts.forEach(function(receipt) {
            var row = '<tr>';
            row += '<td>' + i + '</td>';
            row += '<td>' + new Date(receipt.date).toDateString() + '</td>';
            row += '<td>' + receipt.number + '</td>';
            row += '<td>' + receipt.amount + '</td>';
            row += '<td>' + receipt.type + '</td>';
            row += '</tr>';
            i++;

            $('#receiptsTableChecklistTab tbody').append(row);
        });

        // setting selfClaimDetails in localStorage 
        var selfClaimDetails = {
            insurerId: selfClaim.insuranceInfo.insurerId,
            tpaId: selfClaim.insuranceInfo.tpaId
        };

        globals.localStorageService
                .setItem(globals.constants.SELF_CLAIM_DETAILS_LOCAL_STORAGE_KEY, 
                        selfClaimDetails);
    }
}

$(document).ready(function() {

	// initialise semantic ui elements
	$('.ui.checkbox').checkbox();
	$('.ui.dropdown').dropdown();
	$.tab();
	$('.button').popup();

    init();

    // clear localStorage data on logout
    $('a[href="logout"]').on('click', function() {
        globals.localStorageService
                .deleteItem(globals.constants.BANK_DETAILS_LOCAL_STORAGE_KEY);
    });

	_progressStepsDom = $('#progressSteps');
	var insuranceTabErrorMessage = $('#insuranceTabErrorMessage');

	// getting latest self claim info
	globals.ajaxService.getLatestSelfClaim({}, function successCallback(result) {
		_latestSelfClaim = result;
		setActiveTab(_latestSelfClaim.progressLevel); // setting active tab
		updateProgressSteps(_latestSelfClaim.progressLevel); // updating completed, active and disabled steps

	    // update Insurance tab
	    updateInsuranceTab(_latestSelfClaim);

	    // update Treatment tab
	    updateTreatmentTab(_latestSelfClaim);

	    // update Bills tab
	    updateBillsTab(_latestSelfClaim.bills);

        // update Receipts tab
        updateReceiptsTab(_latestSelfClaim.receipts);

        // update Checklist tab
        updateChecklistTab(_latestSelfClaim);

	}, function failureCallback(message) {
		globals.showToastMessage('Error', message, 'error');
	});

	// registering click event listener on progress steps
	_progressStepsDom.children('a').on('click', function(e) {
		var tabToActivate = $(this).attr('data-tab');
		$.tab('change tab', tabToActivate);
	});

    // toggle policyHolderInfoSegment based on isPatientAlsoPolicyHolder
    $('#insuranceTabForm input[name="isPatientAlsoPolicyHolder"]').on('change', function(e) {
        var isPatientAlsoPolicyHolder = e.target.value;
        if (isPatientAlsoPolicyHolder == 'no') {
            $('#policyHolderInfoSegment').removeClass('hidden');
        } else {
            $('#policyHolderInfoSegment').addClass('hidden');
        }
    });


	$('#insuranceTabSaveAndMoveButton').on('click', function(e) {
	    e.preventDefault();

	    insuranceTabErrorMessage.empty();

	    // validations and increase progress level
	    var errorMessage = '';
	    var hasError = false;
        var pin = $('#insuranceTabForm input[data-field="communicationAddressPin"]').val();
        var policyNumber = $('#insuranceTabForm input[data-field="policyNumber"]').val();

        if ($('#insuranceTabForm input[data-field="patientName"]').val() == '') {
            errorMessage += '<p>Please enter patient name.</p>';
            hasError = true;
        }

	    if ($('#insuranceTabForm input[data-field="hospitalName"]').val() == '') {
	        errorMessage += '<p>Please enter hospital name.</p>';
	        hasError = true;
	    }

	    if ($('#insuranceTabForm input[data-field="hospitalCity"]').val() == '') {
	        errorMessage += '<p>Please enter hospital city.</p>';
	        hasError = true;
	    }

        if ($('#insuranceTabForm input[data-field="dateOfAdmission"]').val() == '') {
            errorMessage += '<p>Please enter date of admission.</p>';
            hasError = true;
        }

        if ($('#insuranceTabForm input[data-field="dateOfDischarge"]').val() == '') {
            errorMessage += '<p>Please enter date of discharge.</p>';
            hasError = true;
        } else if ($('#insuranceTabForm input[data-field="dateOfDischarge"]').val() < $('#insuranceTabForm input[data-field="dateOfAdmission"]').val()) {
            errorMessage += '<p>Date of discharge should be greater than date of admission.</p>';
            hasError = true;
        }

        var patientDob = $('#insuranceTabForm input[data-field="patientDob"]').val();
        
       if (patientDob == '') {
           errorMessage += '<p>Please enter patient\'s date of birth.</p>';
           hasError = true;
       } else {
           var currentDate = new Date();

           // comparing dates
           patientDob = new Date(patientDob);
           if (patientDob.getTime() >  currentDate.getTime()) {
               errorMessage += '<p>Please enter patient\'s valid date of birth.</p>'
           }
       }
      
        if (($('#insuranceTabForm input[data-field="communicationAddressLine1"]').val() == ''
                && $('#insuranceTabForm input[data-field="communicationAddressLine2"]').val() == '')
                || $('#insuranceTabForm input[data-field="communicationAddressCity"]').val() == ''
                || $('#insuranceTabForm input[data-field="communicationAddressState"]').val() == ''
                || $('#insuranceTabForm input[data-field="communicationAddressPin"]').val() == '') {

            errorMessage += '<p>Please enter complete postal communication address.</p>';
            hasError = true;
        }
        if (pin.length != 6) {
            errorMessage += '<p>Please enter valid PIN code.</p>';
            hasError = true;
        }
        var communicationEmail = $('#insuranceTabForm input[data-field="communicationAddressEmail"]').val();
        var atpos=communicationEmail.indexOf("@");
        var dotpos=communicationEmail.lastIndexOf(".");
        var communicationMobile = $('#insuranceTabForm input[data-field="communicationAddressPhone"]').val();

        function validateEmail(communicationEmail) {
            var emailReg = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z]{2,4})+$/;
            return emailReg.test( communicationEmail );
        }

        if (communicationEmail == '') {
            errorMessage += '<p>Please enter your email address.</p>';
            hasError = true;
        } else if (!validateEmail(communicationEmail)) {
            errorMessage += '<p>Please enter correct email address.</p>';
            hasError = true;
        }

        if (communicationMobile == '') {
            errorMessage += '<p>Please provide your mobile number.</p>';
            hasError = true;
        } else if (!communicationMobile.match(/^\d{10}$/)) {
            errorMessage += '<p>Mobile number must be 10 digit.</p>';
            hasError = true;
        }
        
        if ($('#insuranceTabForm input[name="isPatientAlsoPolicyHolder"]:checked').val() == 'no') {
            if ($('#insuranceTabForm input[data-field="policyHolderName"]').val() == '') {
                errorMessage += '<p>Please enter policy holder name.</p>';
                hasError = true;
            }
        }

	    if ($('#insuranceTabForm input[data-field="policyNumber"]').val() == ''
                && $('#insuranceTabForm input[data-field="insurerCustomerId"]').val() == ''
                && $('#insuranceTabForm input[data-field="tpaCustomerId"]').val() == '') {
            errorMessage += '<p>Please enter policy number or insurer customer Id or TPA customer Id.</p>';
            hasError = true;
        }

        if (policyNumber !='') {        
            if(!/^[0-9a-zA-Z/ -]+$/g.test(policyNumber)) {
            errorMessage += '<p>Please enter correct policy Number.</p>';
             hasError = true;
        }
        }
        // Check for insurerId
        var userEnteredInsurerName = $('#insuranceTabForm input[data-field="insurerId"]').val();
        var isUserEnteredInsurerNameValid = false;

        for (var i = 0; i < globals.insurers.length; i++) {
            if (globals.insurers[i].name == userEnteredInsurerName) {
                isUserEnteredInsurerNameValid = true;
                break;
            }
        }

        if (!isUserEnteredInsurerNameValid) {
            hasError = true;
            errorMessage += '<p>Please enter correct insurer name. You can choose from dropdown</p>';
        }

        // Check for tpaId
        var userEnteredTpaName = $('#insuranceTabForm input[data-field="tpaId"]').val();
        var isUserEnteredTpaNameValid = false;

        for (var i = 0; i < globals.tpas.length; i++) {
            if (globals.tpas[i].name == userEnteredTpaName
                    || userEnteredTpaName == 'NA') {
                isUserEnteredTpaNameValid = true;
                break;
            }
        }

        if (!isUserEnteredTpaNameValid) {
            hasError = true;
            errorMessage += '<p>Please enter correct tpa name. Type NA if not applicable.</p>';
        }

	    if (hasError) {
	        insuranceTabErrorMessage.append(errorMessage);
	    } else {
	        // increase the progressLevel and save info
	        _latestSelfClaim.progressLevel = 2;
	        saveInsuranceTabDetails();
	    }
	});

	$('#insuranceTabSaveButton').on('click', function(e) {
	    e.preventDefault();
	    insuranceTabErrorMessage.empty();
	    saveInsuranceTabDetails();
	});

	var saveInsuranceTabDetails = function() {
	    var selfClaim = {};

        if ($('#insuranceTabForm input[name="isPatientAlsoPolicyHolder"]:checked').val() == 'no') {
            selfClaim.isPatientAlsoPolicyHolder = false;
            selfClaim.patientRelationshipWithPolicyHolder = 
                    $('#insuranceTabForm select[data-field="patientRelationshipWithPolicyHolder"]').val();
        } else {
            selfClaim.isPatientAlsoPolicyHolder = true;
            selfClaim.patientRelationshipWithPolicyHolder = 'self';
        }
	    selfClaim.scid = _latestSelfClaim.scid;
	    selfClaim.userSsid = _latestSelfClaim.userSsid;
	    selfClaim.progressLevel = _latestSelfClaim.progressLevel;

	    // save info to db
	    globals.ajaxService.saveSelfClaim(selfClaim, function successCallback(result) {

            var policyHolder = _latestSelfClaim.policyHolder;

	        if (!selfClaim.isPatientAlsoPolicyHolder) {
                policyHolder.name = $('#insuranceTabForm input[data-field="policyHolderName"]').val();
            } else {
                policyHolder.name = $('#insuranceTabForm input[data-field="patientName"]').val();
            }

            globals.ajaxService.savePolicyHolder(policyHolder, function successCallback(result) {
            }, function failureCallback(message) {
                globals.showToastMessage('Error', message, 'error');
            });

            var communicationInfo = _latestSelfClaim.communicationInfo;
            communicationInfo.email = 
                    $('#insuranceTabForm input[data-field="communicationAddressEmail"]').val();
            communicationInfo.mobile = 
                    $('#insuranceTabForm input[data-field="communicationAddressPhone"]').val();

            var communicationAddress = communicationInfo.address || {};
            communicationAddress.line1 = 
                    $('#insuranceTabForm input[data-field="communicationAddressLine1"]').val();
            communicationAddress.line2 = 
                    $('#insuranceTabForm input[data-field="communicationAddressLine2"]').val();
            communicationAddress.city = 
                    $('#insuranceTabForm input[data-field="communicationAddressCity"]').val();
            communicationAddress.state = 
                    $('#insuranceTabForm input[data-field="communicationAddressState"]').val();
            communicationAddress.pin = 
                    $('#insuranceTabForm input[data-field="communicationAddressPin"]').val();

            if (communicationInfo.addressId) {
                // update address
                globals.ajaxService.updateAddress(communicationAddress, function successCallback(result) {
                }, function failureCallback(message) {
                    globals.showToastMessage('Error', message, 'error');
                });

                // update other fields of communication info
                globals.ajaxService.saveCommunicationInfo(communicationInfo, function successCallback(result) {
                }, function failureCallback(message) {
                    globals.showToastMessage('Error', message, 'error');
                });
            } else {
                // create address as well as insert this addressId to communicationInfo
                globals.ajaxService.createAddress(communicationAddress, function successCallback(result) {
                    communicationInfo.addressId = result.id;
                    globals.ajaxService.saveCommunicationInfo(communicationInfo, function successCallback(result) {
                    }, function failureCallback(message) {
                        globals.showToastMessage('Error', message, 'error');
                    });
                }, function failureCallback(message) {
                    globals.showToastMessage('Error', message, 'error');
                });
            }

	        var patient = _latestSelfClaim.patient;
            patient.name = $('#insuranceTabForm input[data-field="patientName"]').val();
            patient.dob = $('#insuranceTabForm input[data-field="patientDob"]').val();
            patient.gender = $('#insuranceTabForm input[name="patientGender"]:checked').val();
            patient.occupation = $('#insuranceTabForm select[data-field="patientOccupation"]').val();
            
            // save info to db
            globals.ajaxService.savePatient(patient, function successCallback(result) {

                var hospitalInfo = _latestSelfClaim.hospitalInfo;
                hospitalInfo.name = $('#insuranceTabForm input[data-field="hospitalName"]').val();
                hospitalInfo.city = $('#insuranceTabForm input[data-field="hospitalCity"]').val();
                hospitalInfo.state = $('#insuranceTabForm input[data-field="hospitalState"]').val();
                hospitalInfo.dateOfAdmission = 
                        $('#insuranceTabForm input[data-field="dateOfAdmission"]').val() 
                hospitalInfo.dateOfDischarge = 
                        $('#insuranceTabForm input[data-field="dateOfDischarge"]').val();

                globals.ajaxService.saveHospitalInfo(hospitalInfo, function successCallback(result) {
                    var insuranceInfo = _latestSelfClaim.insuranceInfo;
                    insuranceInfo.policyNumber = $('#insuranceTabForm input[data-field="policyNumber"]').val();
                    insuranceInfo.insurerCustomerId = 
                            $('#insuranceTabForm input[data-field="insurerCustomerId"]').val();
                    
                    // this is actually insurer name, needs to be converted into id
                    insuranceInfo.insurerId = $('#insuranceTabForm input[data-field="insurerId"]').val();

                    for (var i = 0; i < globals.insurers.length; i++) {
                        if (globals.insurers[i].name == insuranceInfo.insurerId) {
                            insuranceInfo.insurerId = globals.insurers[i].id;
                            break;
                        }
                    }

                    // this is actually tpa name, needs to be converted into id
                    insuranceInfo.tpaId = $('#insuranceTabForm input[data-field="tpaId"]').val();
                    insuranceInfo.tpaCustomerId = $('#insuranceTabForm input[data-field="tpaCustomerId"]').val();

                    if (insuranceInfo.tpaId == 'NA' || insuranceInfo.tpaId == '') { // Not Applicable
                        insuranceInfo.tpaId = '';
                        insuranceInfo.tpaCustomerId = '';
                    } else {
                        for (var i = 0; i < globals.tpas.length; i++) {
                            if (globals.tpas[i].name == insuranceInfo.tpaId) {
                                insuranceInfo.tpaId = globals.tpas[i].id;
                                break;
                            }
                        }
                    }

                    insuranceInfo.corporateName = $('#insuranceTabForm input[data-field="corporateName"]').val();
                    insuranceInfo.employeeId = $('#insuranceTabForm input[data-field="employeeId"]').val();

                    // save info to db
                    globals.ajaxService.saveInsuranceInfo(insuranceInfo, function successCallback(result) {
                        globals.showToastMessage('Success', 'Insurance Info Saved', 'success');

                        // setting active tab
                        setActiveTab(_latestSelfClaim.progressLevel); 

                        // updating completed, active and disabled step
                        updateProgressSteps(_latestSelfClaim.progressLevel);
                    }, function failureCallback(message) {
                        globals.showToastMessage('Error', message, 'error');
                    });
                }, function failureCallback(message) {
                    globals.showToastMessage('Error', message, 'error');
                });

            }, function failureCallback(message) {
                globals.showToastMessage('Error', message, 'error');
            });

	    }, function failureCallback(message) {
	        globals.showToastMessage('Error', message, 'error');
	    });
	};
});