/**
 * @author Varun Kumar<varunon9@gmail.com>
 * https://github.com/varunon9
 */
 
'use strict';

function populatePolicyHolderDetails(policyHolder, insuranceInfo, selfClaim, communicationInfo) {

    if (insuranceInfo.policyNumber) {
        $('#detailsOfPrimaryInsured span[data-field="policyNumber"]')
                .text(insuranceInfo.policyNumber.toUpperCase());
    }       

    if (insuranceInfo.tpaCustomerId) {
        $('#detailsOfPrimaryInsured span[data-field="tpaIdNo"]')
                .text(selfClaim.insuranceInfo.tpaCustomerId.toUpperCase());
    }
    
    $('#detailsOfPrimaryInsured span[data-field="policyHolderName"]').text(policyHolder.name.toUpperCase());

    // will override name
    if (selfClaim.isPatientAlsoPolicyHolder) {
    	$('#detailsOfPrimaryInsured span[data-field="policyHolderName"]').text(selfClaim.patient.name);
    }

    $('#detailsOfPrimaryInsured span[data-field="policyHolderAddress"]')
            .text(getAddress(communicationInfo.address).toUpperCase());
    $('#detailsOfPrimaryInsured span[data-field="policyHolderCity"]')
            .text(communicationInfo.address.city.toUpperCase());
    $('#detailsOfPrimaryInsured span[data-field="policyHolderState"]')
            .text(communicationInfo.address.state.toUpperCase());
    $('#detailsOfPrimaryInsured span[data-field="policyHolderPin"]').text(communicationInfo.address.pin);
    $('#detailsOfPrimaryInsured span[data-field="policyHolderPhone"]').text(communicationInfo.mobile);
    $('#detailsOfPrimaryInsured span[data-field="policyHolderEmail"]').text(communicationInfo.email);

    //Extra fields for apollo munich form
    $('#detailsOfPrimaryInsured span[data-field="addressOfPolicyHolder"]')
        .text(getAddress(communicationInfo.address).toUpperCase() + ", " 
        + communicationInfo.address.city.toUpperCase() + ", " 
        + communicationInfo.address.state.toUpperCase() + "-"
        + communicationInfo.address.pin);
    $('#detailsOfInsuredPersonHospitalized span[data-field="mobileOfPolicyHolder"]')
        .text(communicationInfo.mobile);
    $('#detailsOfInsuredPersonHospitalized span[data-field="emailOfPolicyHolder"]')
        .text(communicationInfo.email);
}

function getAge(dob) {
	var today = new Date();
    var birthDate = new Date(dob);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m == 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

function getAddress(address) {
	if (address) {
		return address.line1 + ', ' + address.line2;
	} else {
		return '';
	}
} 

function populatePatientDetails(patient, relationship, communicationInfo) {

    var dobOfPatient = new Date(patient.dob);       
    var dobOfPatientFormat = dobOfPatient.getDate() + '/' 
        + (dobOfPatient.getMonth() + 1) + '/' 
        + dobOfPatient.getFullYear();

    $('#detailsOfInsuredPersonHospitalized span[data-field="patientName"]')
            .text(patient.name.toUpperCase());
    if (patient.gender == 'male') {
        $('#detailsOfInsuredPersonHospitalized input[data-field="genderMale"]')
            .prop("checked", true);
        } else {
            $('#detailsOfInsuredPersonHospitalized input[data-field="genderFemale"]')
            .prop("checked", true);
        }
    $('#detailsOfInsuredPersonHospitalized span[data-field="patientAge"]')
            .text(getAge(patient.dob));
    $('#detailsOfInsuredPersonHospitalized span[data-field="patientDob"]')
            .text(dobOfPatientFormat);
    $('#detailsOfInsuredPersonHospitalized span[data-field="patientRelationshipWithPolicyHolder"]')
            .text(relationship);
    if (relationship=='self') {
        $('#detailsOfInsuredPersonHospitalized input[data-field="RelationshipSelf"]')
            .prop("checked", true);
    } else if(relationship=='spouse') {
        $('#detailsOfInsuredPersonHospitalized input[data-field="RelationshipSpouse"]')
            .prop("checked", true);
    } else if(relationship=='child') {
        $('#detailsOfInsuredPersonHospitalized input[data-field="RelationshipChild"]')
            .prop("checked", true);
    } else if(relationship=='father') {
        $('#detailsOfInsuredPersonHospitalized input[data-field="RelationshipFather"]')
            .prop("checked", true);
    } else if(relationship=='mother') {
        $('#detailsOfInsuredPersonHospitalized input[data-field="RelationshipMother"]')
            .prop("checked", true);
    } else {
        $('#detailsOfInsuredPersonHospitalized input[data-field="RelationshipOther"]')
            .prop("checked", true);
    }
    $('#detailsOfInsuredPersonHospitalized span[data-field="patientOccupation"]')
            .text(patient.occupation);
    if (patient.occupation == 'service') {
        $('#detailsOfInsuredPersonHospitalized input[data-field="OccupationService"]')
            .prop("checked", true);
    } else if (patient.occupation == 'retired') {
        $('#detailsOfInsuredPersonHospitalized input[data-field="OccupationRetired"]')
            .prop("checked", true);
    } else if (patient.occupation == 'self employed') {
        $('#detailsOfInsuredPersonHospitalized input[data-field="OccupationSelf"]')
            .prop("checked", true);
    } else if (patient.occupation == 'new born') {
        $('#detailsOfInsuredPersonHospitalized input[data-field="OccupationNew"]')
            .prop("checked", true);
    } else if (patient.occupation == 'home maker') {
        $('#detailsOfInsuredPersonHospitalized input[data-field="OccupationHome"]')
            .prop("checked", true);
    } else if (patient.occupation == 'student') {
        $('#detailsOfInsuredPersonHospitalized input[data-field="OccupationStudent"]')
            .prop("checked", true);
    } else {
        $('#detailsOfInsuredPersonHospitalized input[data-field="OccupationOther"]')
            .prop("checked", true);
    }
    $('#detailsOfInsuredPersonHospitalized span[data-field="patientAddress"]')
            .text();
    $('#detailsOfInsuredPersonHospitalized span[data-field="patientCity"]')
            .text();
    $('#detailsOfInsuredPersonHospitalized span[data-field="patientState"]')
            .text();
    $('#detailsOfInsuredPersonHospitalized span[data-field="patientPinCode"]')
            .text();
    $('#detailsOfInsuredPersonHospitalized span[data-field="patientPhone"]')
            .text();
    $('#detailsOfInsuredPersonHospitalized span[data-field="patientEmail"]')
            .text();

}

function getInjuryOrDiseaseOrDeliveryDate(treatmentInfo) {
	var date; 

	if (treatmentInfo.reasonForHospitalization == 'illness') {
		date = treatmentInfo.diseaseFirstDetectedDate;
	} else if (treatmentInfo.reasonForHospitalization == 'injury') {
		date = treatmentInfo.dateOfInjury;
	} else {
		date = treatmentInfo.dateOfDelivery;
	}
	return new Date(date);
}

function populateHospitalizationDetails(hospitalInfo, treatmentInfo) {

    var treatmentDate = getInjuryOrDiseaseOrDeliveryDate(treatmentInfo);       
    var treatmentDateFormat = treatmentDate.getDate() + '/' 
        + (treatmentDate.getMonth() + 1) + '/' 
        + treatmentDate.getFullYear();

    var admissionDate = new Date(hospitalInfo.dateOfAdmission);           
    var admissionDateFormat = admissionDate.getDate() + '/' 
        + (admissionDate.getMonth() + 1) + '/' 
        + admissionDate.getFullYear();

    var dischargeDate = new Date(hospitalInfo.dateOfDischarge);           
    var dischargeDateFormat = dischargeDate.getDate() + '/' 
        + (dischargeDate.getMonth() + 1) + '/' 
        + dischargeDate.getFullYear();

    $('#detailsOfHospitalization span[data-field="hospitalName"]')
            .text(hospitalInfo.name.toUpperCase());
    // $('#detailsOfHospitalization span[data-field="hospitalRoomCategory"]')
    //         .text(treatmentInfo.roomCategory);
    if (treatmentInfo.roomCategory == 'day care') {
        $('#detailsOfHospitalization input[data-field="RoomCategoryDay"]')
            .prop("checked", true);
        } else if (treatmentInfo.roomCategory == 'single occupancy') {
        $('#detailsOfHospitalization input[data-field="RoomCategorySingle"]')
            .prop("checked", true);
        } else if (treatmentInfo.roomCategory == 'twin sharing') {
        $('#detailsOfHospitalization input[data-field="RoomCategoryTwin"]')
            .prop("checked", true);
        } else if (treatmentInfo.roomCategory == 'general ward') {
        $('#detailsOfHospitalization input[data-field="RoomCategoryThree"]')
            .prop("checked", true);
        }
    if (treatmentInfo.reasonForHospitalization == 'illness') {
        $('#detailsOfHospitalization input[data-field="Hospitalillness"]')
            .prop("checked", true);
        } else if (treatmentInfo.reasonForHospitalization == 'injury') {
            $('#detailsOfHospitalization input[data-field="Hospitalinjury"]')
                .prop("checked", true);
        } else {
            $('#detailsOfHospitalization input[data-field="HospitalMaternity"]')
                .prop("checked", true);
        }
    $('#detailsOfHospitalization span[data-field="hospitalizationReason"]')
            .text(treatmentInfo.reasonForHospitalization.toUpperCase());

    $('#detailsOfHospitalization span[data-field="injuryOrDiseaseOrDeliveryDate"]')
            .text(treatmentDateFormat);

    $('#detailsOfHospitalization span[data-field="dateOfAdmission"]').text(admissionDateFormat);
            
    $('#detailsOfHospitalization span[data-field="dateOfDischarge"]').text(dischargeDateFormat);    


    if (treatmentInfo.reasonForHospitalization == 'injury') {
        if (treatmentInfo.causeOfInjury == 'self inflicted') {
        $('#detailsOfHospitalization input[data-field="injuryCauseSelf"]')
            .prop("checked", true);
        } else if(treatmentInfo.causeOfInjury == 'road traffic accident') {
            $('#detailsOfHospitalization input[data-field="injuryCauseRoad"]')
            .prop("checked", true);
        } else {
            $('#detailsOfHospitalization input[data-field="injuryCauseOther"]')
            .prop("checked", true);
        }
        if (treatmentInfo.isCaseMedicoLegal == true ) {
            $('#detailsOfHospitalization input[data-field="isMedicoLegalYes"]')
            .prop("checked", true);
        } else {
            $('#detailsOfHospitalization input[data-field="isMedicoLegalNo"]')
            .prop("checked", true);
        }    	
        // $('#detailsOfHospitalization span[data-field="isMedicoLegal"]')
        //         .text(treatmentInfo.isCaseMedicoLegal == true ? 'Yes' : 'No');
        if (treatmentInfo.wasCaseReportedToPolice == true ) {
            $('#detailsOfHospitalization input[data-field="wasCaseReportedToPoliceYes"]')
            .prop("checked", true);
        } else {
            $('#detailsOfHospitalization input[data-field="wasCaseReportedToPoliceNo"]')
            .prop("checked", true);
        } 
        // $('#detailsOfHospitalization span[data-field="isReportedToPolice"]')
        //         .text(treatmentInfo.wasCaseReportedToPolice == true ? 'Yes' : 'No');
    }
}

function populateClaimDetails(bills, hospitalInfo) {
    // date of admission
    var doa = hospitalInfo.dateOfAdmission;
    doa = new Date(doa);
    var doaTime = doa.getTime();

    // date of discharge
    var dod = hospitalInfo.dateOfDischarge;
    dod = new Date(dod);
    var dodTime = dod.getTime();

    var preHospitalizationExpenses = 0;
    var postHospitalizationExpenses = 0;
    var hospitalizationExpenses = 0;
   
    for (var i = 0; i < bills.length; i++) {
        var billDate = new Date(bills[i].date);
        var billDateTime = billDate.getTime();

        if (billDateTime < doaTime) {
            preHospitalizationExpenses += bills[i].amount;
        } else if (billDateTime > dodTime) {
            postHospitalizationExpenses += bills[i].amount;
        } else {
            hospitalizationExpenses += bills[i].amount;
        }
    }


    var totalHospitalizationExpenses = preHospitalizationExpenses
           + postHospitalizationExpenses
           + hospitalizationExpenses;

    $('#detailsOfClaim span[data-field="preHospitalizationExpense"]')
            .text(preHospitalizationExpenses);
    $('#detailsOfClaim span[data-field="postHospitalizationExpense"]')
            .text(postHospitalizationExpenses);
    $('#detailsOfClaim span[data-field="hospitalizationExpense"]')
            .text(hospitalizationExpenses);

    // todo: add other treatment expenses here s well e.g. health checkup, ambulance
    $('#detailsOfClaim span[data-field="totalTreatmentExpense"]')
            .text(totalHospitalizationExpenses);

}

function populateBillsTable(bills, hospitalInfo) {
    var doa = hospitalInfo.dateOfAdmission;
    doa = new Date(doa);
    var doaTime = doa.getTime();

    // date of discharge
    var dod = hospitalInfo.dateOfDischarge;
    dod = new Date(dod);
    var dodTime = dod.getTime();

    var preHospitalizationExpenses = 0;
    var postHospitalizationExpenses = 0;
    var hospitalizationExpenses = 0;
    var pharm = 0;
    var bloodTotal = 0;
    var mainBill = 0;


    for (var i = 0; i < bills.length; i++) {
        var billDate = new Date(bills[i].date);
        var billDateTime = billDate.getTime();
        var bill = bills[i];

        if (bill.type =='pharmacy') {
            pharm += bills[i].amount;
        }
        if (bill.type == 'hospital main bill') {
            mainBill += bills[i].amount;
        }
        if (bill.isBloodBank) {
            bloodTotal += bills[i].amount;
        }
        if (billDateTime < doaTime && bill.type != 'pharmacy') {
            preHospitalizationExpenses += bills[i].amount;
        } else if (billDateTime > dodTime && bill.type != 'pharmacy') {
            postHospitalizationExpenses += bills[i].amount;
        } else {
            hospitalizationExpenses += bills[i].amount;
        }

    }

    var totalHospitalizationExpenses = preHospitalizationExpenses
           + postHospitalizationExpenses
           + hospitalizationExpenses;
    var tableRows = '';
    var totalBills = bills.length;

    if (totalBills > 5) {
        
        $('#hiddenTable').removeClass('hiddenTab');
        $('.first').addClass('hiddenTab');
        $('.second').addClass('hiddenTab');

        for (var i = 0; i < bills.length; i++) {
            var billDate = new Date(bill.date);       
            var billDateFormat = billDate.getDate() + '/' 
                + (billDate.getMonth() + 1) + '/' 
                + billDate.getFullYear();

        	tableRows += '<tr>';
        	var bill = bills[i];        
        	tableRows += '<td>' + (i + 1) + '</td>';
        	tableRows += '<td>' + bill.number + '</td>';
            tableRows += '<td>' + billDateFormat + '</td>';
            tableRows += '<td>' + (bill.issuedBy ? bill.issuedBy : '') + '</td>';
            

            switch(i) {

                case 0:
                    tableRows += '<td>Hospital main Bill:</td>';
                    tableRows += '<td>' + mainBill + '</td>';
                    break;

                case 1:
                    tableRows += '<td>Pre-hospitalization Bills:</td>';
                    tableRows += '<td>' + preHospitalizationExpenses + '</td>';
                    break;

                case 2:
                    tableRows += '<td>Post-hospitalization Bills:</td>';
                    tableRows += '<td>' + postHospitalizationExpenses + '</td>';
                    break;

                case 3:
                    tableRows += '<td>Pharmacy Bills:</td>';
                    tableRows += '<td>' + pharm + '</td>';
                    break;

                case 4:
                    tableRows += '<td>Blood Bank:</td>';
                    tableRows += '<td>' + bloodTotal + '</td>';
                    break;

                case 5:
                    tableRows += '<td><b>Total:</b></td>';
                    tableRows += '<td><b>' + totalHospitalizationExpenses + '</b></td>';
                    break;

                default:
                    tableRows += '<td></td>';
                    tableRows += '<td></td>';
            }
        	tableRows += '</tr>';
        }
        $('#detailsOfBillsEnclosed table tbody').append(tableRows);  

    } else {

        for (var i = 0; i < bills.length; i++) {
            tableRows += '<tr>';
            var bill = bills[i];
            var billDate = new Date(bill.date);       
            var billDateFormat = billDate.getDate() + '/' 
                + (billDate.getMonth() + 1) + '/' 
                + billDate.getFullYear(); 
            
            tableRows += '<td>' + (i + 1) + '</td>';
            tableRows += '<td>' + bill.number + '</td>';
            tableRows += '<td>' + billDateFormat + '</td>';
            tableRows += '<td>' + (bill.issuedBy ? bill.issuedBy : '') + '</td>';
            tableRows += '</tr>';
        }   

        $('#detailsOfBillsEnclosed table.first tbody').append(tableRows);
            var tableRow = '';

            tableRow += '<tr>';
            tableRow += '<td>Hospital main Bill:</td>';
            tableRow += '<td>' + mainBill + '</td>';
            tableRow += '</tr>';

            tableRow += '<tr>';          
            tableRow += '<td>Pre-hospitalization Bills:</td>';
            tableRow += '<td>' + preHospitalizationExpenses + '</td>';
            tableRow += '</tr>';

            tableRow += '<tr>';
            tableRow += '<td>Post-hospitalization Bills:</td>';
            tableRow += '<td>' + postHospitalizationExpenses + '</td>';
            tableRow += '</tr>';

            tableRow += '<tr>';
            tableRow += '<td>Pharmacy Bills:</td>';
            tableRow += '<td>' + pharm + '</td>';
            tableRow += '</tr>';

            tableRow += '<tr>';
            tableRow += '<td>Blood Bank:</td>';
            tableRow += '<td>' + bloodTotal + '</td>';
            tableRow += '</tr>';

            tableRow += '<tr>';
            tableRow += '<td><b>Total:</b></td>';
            tableRow += '<td><b>' + totalHospitalizationExpenses + '</b></td>';            
            tableRow += '</tr>';

        $('#detailsOfBillsEnclosed table.second tbody').append(tableRow);
    }

}


$(document).ready(function() {

	// getting latest self claim info
	globals.ajaxService.getLatestSelfClaim({}, function successCallback(result) {
		var selfClaim = result;

		populatePolicyHolderDetails(selfClaim.policyHolder, 
                selfClaim.insuranceInfo, selfClaim, selfClaim.communicationInfo);

		if (selfClaim.isPatientAlsoPolicyHolder) {
			selfClaim.patientRelationshipWithPolicyHolder = 'self'; // todo: make changes in db
		}

		populatePatientDetails(selfClaim.patient, selfClaim.patientRelationshipWithPolicyHolder,
			    selfClaim.communicationInfo);

		populateHospitalizationDetails(selfClaim.hospitalInfo, selfClaim.treatmentInfo);

		populateClaimDetails(selfClaim.bills, selfClaim.hospitalInfo);

        populateBillsTable(selfClaim.bills, selfClaim.hospitalInfo);

	}, function failureCallback(message) {
		globals.showToastMessage('Error', message, 'error');
	});

	$('#generatePdfButton').on('click', function() {
		window.print();
	});

    $('#returnToFormButton').on('click', function() {
        window.location = 'dashboard';
    });

});