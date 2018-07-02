/**
 * @author Varun Kumar<varunon9@gmail.com>
 * https://github.com/varunon9
 */

'use strict';

$(document).ready(function() {

	// cache DOM for Treatment Tab here
	var injuryFieldsDom = $('#injuryFields');
	var maternityFieldsDom = $('#maternityFields');
	var illnessFieldsDom = $('#illnessFields');
	var treatmentTabErrorMessage = $('#treatmentTabErrorMessage');

    $(maternityFieldsDom).hide();
    $(injuryFieldsDom).hide();

	$('#treatmentTabForm select[data-field="reasonForHospitalization"]').on('change', function(e) {
	    $(maternityFieldsDom).hide();
	    $(injuryFieldsDom).hide();
	    $(illnessFieldsDom).hide();

	    var reason = $(this).val();

	    if (reason == 'maternity') {
	        $(maternityFieldsDom).show();
	    } else if (reason == 'injury') {
	        $(injuryFieldsDom).show();
	    } else {
	        $(illnessFieldsDom).show();
	    }
	});

	$('#treatmentTabSaveAndMoveButton').on('click', function(e) {
	    e.preventDefault();

	    treatmentTabErrorMessage.empty();

	    // validations and increase progress level
	    var errorMessage = '';
	    var hasError = false;
	    var treatmentNameVar = $('#treatmentTabForm input[data-field="treatmentName"]').val();

	    var reason = 
	            $('#treatmentTabForm select[data-field="reasonForHospitalization"]').val();

	    if (reason == 'illness') {

	        if ($('#treatmentTabForm input[data-field="treatmentName"]').val() == '') {
	            errorMessage += '<p>Please enter treatment name.</p>';
	            hasError = true;
	        } else if(!/^[a-zA-Z]+(\s{0,1}[a-zA-Z ])*$/g.test(treatmentNameVar)) {
            errorMessage += '<p>Please enter valid disease name.</p>';
             hasError = true;
        	}
	    } else if (reason == 'injury') {
	        if ($('#treatmentTabForm input[data-field="dateOfInjury"]').val() == '') {
	            errorMessage += '<p>Please enter date of injury.</p>';
	            hasError = true;
	        }
	    } else {
	        if ($('#treatmentTabForm input[data-field="dateOfDelivery"]').val() == '') {
	            errorMessage += '<p>Please enter date of delivery.</p>';
	            hasError = true;
	        }
	    }

	    if (hasError) {
	        treatmentTabErrorMessage.append(errorMessage);
	    } else {
	        // increase the progressLevel and save info
	        _latestSelfClaim.progressLevel = 3;
	        saveTreatmentTabDetails();
	    }
	});

	$('#treatmentTabSaveButton').on('click', function(e) {
	    e.preventDefault();
	    treatmentTabErrorMessage.empty();
	    saveTreatmentTabDetails();
	});

	var saveTreatmentTabDetails = function() {
	    var selfClaim = {};
	    selfClaim.scid = _latestSelfClaim.scid;
	    selfClaim.userSsid = _latestSelfClaim.userSsid;
	    selfClaim.progressLevel = _latestSelfClaim.progressLevel;

	    // save info to db
	    globals.ajaxService.saveSelfClaim(selfClaim, function successCallback(result) {

	        var treatmentInfo = _latestSelfClaim.treatmentInfo;
	        var reason = $('#treatmentTabForm select[data-field="reasonForHospitalization"]').val();

	        if (reason == 'maternity') {
		        treatmentInfo.reasonForHospitalization = 
		                $('#treatmentTabForm select[data-field="reasonForHospitalization"]').val();
		        treatmentInfo.diseaseFirstDetectedDate = '';
		        treatmentInfo.treatmentName = '';
		        treatmentInfo.dateOfDelivery = 
		                $('#treatmentTabForm input[data-field="dateOfDelivery"]').val();
		        treatmentInfo.typeOfDelivery = 
		                $('#treatmentTabForm select[data-field="typeOfDelivery"]').val();
		        treatmentInfo.dateOfInjury = '';
		        treatmentInfo.causeOfInjury = '';
		        treatmentInfo.isCaseMedicoLegal = '';
		        treatmentInfo.wasCaseReportedToPolice = '';
		    } else if(reason == 'injury') {
		    	treatmentInfo.reasonForHospitalization = 
		                $('#treatmentTabForm select[data-field="reasonForHospitalization"]').val();
		        treatmentInfo.diseaseFirstDetectedDate = '';
		        treatmentInfo.treatmentName = '';
		        treatmentInfo.dateOfDelivery = '';
		        treatmentInfo.typeOfDelivery = '';
		        treatmentInfo.dateOfInjury = 
		        		$('#treatmentTabForm input[data-field="dateOfInjury"]').val();
		        treatmentInfo.causeOfInjury = 
		        		$('#treatmentTabForm input[name="causeOfInjury"]:checked').val();
		        
			    var isCaseMedicoLegal = 
		                $('#treatmentTabForm input[name="isCaseMedicoLegal"]:checked').val();
		        if (isCaseMedicoLegal && isCaseMedicoLegal == 'yes') {
		            treatmentInfo.isCaseMedicoLegal = true;
		        } else if(isCaseMedicoLegal && isCaseMedicoLegal == 'no') {
		            treatmentInfo.isCaseMedicoLegal = false;
		        }

		        var wasCaseReportedToPolice = 
		                $('#treatmentTabForm input[name="wasCaseReportedToPolice"]:checked').val();
		        if (wasCaseReportedToPolice && wasCaseReportedToPolice == 'yes') {
		            treatmentInfo.wasCaseReportedToPolice = true;
		        } else if(wasCaseReportedToPolice && wasCaseReportedToPolice == 'no') {
		            treatmentInfo.wasCaseReportedToPolice = false;
		        }
		    } else if (reason == 'illness') {
		    	treatmentInfo.reasonForHospitalization = 
		                $('#treatmentTabForm select[data-field="reasonForHospitalization"]').val();
		        treatmentInfo.diseaseFirstDetectedDate = 
		        		$('#treatmentTabForm input[data-field="diseaseFirstDetectedDate"]').val();
		        treatmentInfo.treatmentName = 
		        		$('#treatmentTabForm input[data-field="treatmentName"]').val();
		        treatmentInfo.dateOfDelivery = '';
		        treatmentInfo.typeOfDelivery = '';
		        treatmentInfo.dateOfInjury = '';
		        treatmentInfo.causeOfInjury = '';
		        treatmentInfo.isCaseMedicoLegal = '';
		        treatmentInfo.wasCaseReportedToPolice = '';
		    }

	        treatmentInfo.roomCategory = 
	                $('#treatmentTabForm input[name="roomCategory"]:checked').val();
	  
	        // save info to db
	        globals.ajaxService.saveTreatmentInfo(treatmentInfo, function successCallback(result) {

	            globals.showToastMessage('Success', 'Treatment Info Saved', 'success');

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
	};
});