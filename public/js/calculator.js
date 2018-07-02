/**
 * @author Manoj Kumar<manojswami600@gmail.com>
 */

var claimCalculatorId;
var billsData;
var billId;
var doa;
var dod;
$('#billsTableUpdateButton').css('display', 'none');
$('.bills-section').css('display', 'none');
$('#claimCalculatorBillTable').css('display', 'none');
$('#calculateClaimButton').css('display', 'none');
$('#calculationResult').css('display', 'none');

$('#proceedButton').on('click', function() {
	var dateOfAdmission = $('#calculateClaim input[data-field="dateOfAdmission"]').val();
	var dateOfDischarge = $('#calculateClaim input[data-field="dateOfDischarge"]').val();
	var hasError = false;

	if (dateOfAdmission == '' ) {
		hasError = true;
		$('#dateOfAdmissionError').css('display', 'block');
		$('#dateOfAdmissionError').text('Please select date of Admission');
		setTimeout(function() {
			$('#dateOfAdmissionError').fadeOut('slow');
		}, 4000);
	} else if (dateOfDischarge == '' ) {
		hasError = true;
		$('#dateOfDischargeError').css('display', 'block');
		$('#dateOfDischargeError').text('Please select date of Discharge');
		setTimeout(function() {
			$('#dateOfDischargeError').fadeOut('slow');
		}, 4000);
	} else if (dateOfAdmission > dateOfDischarge) {
		hasError = true;
		$('#dateOfDischargeError').css('display', 'block');
		$('#dateOfDischargeError').text('Date of Discharge or Date of Admission is invalid');
		setTimeout(function() {
			$('#dateOfDischargeError').fadeOut('slow');
		}, 4000);
	}
	if (!hasError) {
		params = {};
		params.dateOfAdmission = $('#calculateClaim input[data-field="dateOfAdmission"]').val();
		params.dateOfDischarge = $('#calculateClaim input[data-field="dateOfDischarge"]').val();
		globals.ajaxService.addClaimCalculatorUser(params, function successCallback(result) {
			claimCalculatorId = result.id;
			doa = dateOfAdmission;
			dod = dateOfDischarge;
			//globals.showToastMessage('Success', 'Added', 'success');
			$('.bills-section').css('display', 'block');
			$('#proceedButton').css('display', 'none');
			$('#calculateClaim input[data-field="dateOfAdmission"]').prop("disabled", true);
			$('#calculateClaim input[data-field="dateOfDischarge"]').prop("disabled", true);
			$('#claimCalculatorBillTable tbody').empty();
		}, function errorCallback(message) {
			globals.showToastMessage('Error', message, 'error');
		});
	}
});

$('#billsTableAddButton').on('click', function() {
	var billDate = $('#calculateClaim input[data-field="billDate"]').val();
	var billAmount = $('#calculateClaim input[data-field="billAmount"]').val();
	var billNumber = $('#calculateClaim input[data-field="billNumber"]').val();
	var billType = $('#calculateClaim input[name="billType"]:checked').val();
	var hasError = false;
	
	if (billDate == '' ) {
		hasError = true;
		$('#billDateError').css('display', 'block');
		$('#billDateError').text('Please select bill date');
		setTimeout(function() {
			$('#billDateError').fadeOut('slow');
		}, 4000);
	} else if (billNumber == '' ) {
		hasError = true;
		$('#billNumberError').css('display', 'block');
		$('#billNumberError').text('Please enter bill number');
		setTimeout(function() {
			$('#billNumberError').fadeOut('slow');
		}, 4000);
	} else if (billAmount == '' ) {
		hasError = true;
		$('#billAmountError').css('display', 'block');
		$('#billAmountError').text('Please enter bill amount');
		setTimeout(function() {
			$('#billAmountError').fadeOut('slow');
		}, 4000);
	}

	if (!hasError) {
		params = {};
		params.billDate = billDate;
		params.billNumber = billNumber;
		params.billAmount = billAmount;
		params.billType = billType;
		params.claimCalculatorId = claimCalculatorId;

		globals.ajaxService.addClaimCalculatorBill(params, function successCallback(result) {
			globals.showToastMessage('Success', 'Bill Added', 'success');
			showClaimCalculatorBills();
			$('#calculateClaim input[data-field="billDate"]').val('');
			$('#calculateClaim input[data-field="billAmount"]').val('');
			$('#calculateClaim input[data-field="billNumber"]').val('');
		}, function errorCallback(error) {
			globals.showToastMessage('Error', error, 'error');
		});
	}
});

function showClaimCalculatorBills() {
	var params = {};
	params.claimCalculatorId = claimCalculatorId;
	globals.ajaxService.showClaimCalculatorBills(params, function successCallback(result) {
		claimCalculatorBillTable(result);
		if (result.length != '0') {
			$('#claimCalculatorBillTable').css('display', 'inline-table');
			$('#calculateClaimButton').css('display', 'block');
		} else {
			$('#claimCalculatorBillTable').css('display', 'none');
			$('#calculateClaimButton').css('display', 'none');
		}
		billsData = result;
	}, function errorCallback(error) {
		globals.showToastMessage('Error', error, 'error');
	});
}

function claimCalculatorBillTable(data) {
	$('#claimCalculatorBillTable tbody').empty();

	var sNo = 1;

	for (var i = 0; i < data.length; i++) {
		var row = '<tr>';
		row += '<td>' + sNo + '</td>';
		row += '<td>' + dateFormat(data[i].billDate) + '</td>';
		row += '<td>' + data[i].billNumber + '</td>';
		row += '<td>' + data[i].billAmount + '</td>';
		row += '<td>' + data[i].billType + '</td>';
		row += '<td><i id="editButton" class="pencil alternate icon edit-button" title="Edit"'
                + 'onClick="editBillButtonClicked(' + data[i].id + ');"></i></td>';
		row += '<td><i class="trash alternate outline icon delete-button" title="Delete"' 
                + 'onClick="deleteBillButtonClicked(' + data[i].id + ');"></i> </td>';
		sNo++;
		$('#claimCalculatorBillTable tbody').append(row);
	}
}

function deleteBillButtonClicked(id) {
	var params = {};
	params.id = id;
	globals.ajaxService.deleteClaimCalculatorBill(params, function successCallback(result) {
		globals.showToastMessage('Success', 'Bill Deleted', 'success');
		showClaimCalculatorBills();
	}, function errorCallback(error) {
		globals.showToastMessage('Error', error, 'error');
	});
}

function editBillButtonClicked(billId) {

	var bill;
	for (var i = 0; i < billsData.length; i++) {
		if (billsData[i].id == billId) {
			bill = billsData[i];
			break;
		}
	}
	showSelectedBill(bill);
	$('#billsTableUpdateButton').css('display', 'block');
	$('#billsTableAddButton').css('display', 'none');
}

// show bill (filled in form) to user
function showSelectedBill(bill) {
	billId = bill.id;
    if (bill) {
        $('#calculateClaim input[data-field="billDate"]').val(formatDate(bill.billDate));
        $('#calculateClaim input[data-field="billNumber"]').val(bill.billNumber);
        $('#calculateClaim input[data-field="billAmount"]').val(bill.billAmount);

        if (bill.billType) {
            $('#calculateClaim input[name="billType"]').removeAttr('checked');
        }
        $('#calculateClaim input[name="billType"][value="' + bill.billType + '"]')
                .attr('checked', 'checked').click();
    }
}

$('#billsTableUpdateButton').on('click', function() {
	var billDate = $('#calculateClaim input[data-field="billDate"]').val();
	var billAmount = $('#calculateClaim input[data-field="billAmount"]').val();
	var billNumber = $('#calculateClaim input[data-field="billNumber"]').val();
	var billType = $('#calculateClaim input[name="billType"]:checked').val();
	var hasError = false;
	
	if (billDate == '' ) {
		hasError = true;
		$('#billDateError').css('display', 'block');
		$('#billDateError').text('Please select bill date');
		setTimeout(function() {
			$('#billDateError').fadeOut('slow');
		}, 4000);
	} else if (billNumber == '' ) {
		hasError = true;
		$('#billNumberError').css('display', 'block');
		$('#billNumberError').text('Please enter bill number');
		setTimeout(function() {
			$('#billNumberError').fadeOut('slow');
		}, 4000);
	} else if (billAmount == '' ) {
		hasError = true;
		$('#billAmountError').css('display', 'block');
		$('#billAmountError').text('Please enter bill amount');
		setTimeout(function() {
			$('#billAmountError').fadeOut('slow');
		}, 4000);
	}

	if (!hasError) {
		params = {};
		params.billDate = billDate;
		params.billNumber = billNumber;
		params.billAmount = billAmount;
		params.billType = billType;
		params.billId = billId;

		globals.ajaxService.updateClaimCalculatorBill(params, function successCallback(result) {
			globals.showToastMessage('Success', 'Bill Updated', 'success');
			showClaimCalculatorBills();
			$('#calculateClaim input[data-field="billDate"]').val('');
			$('#calculateClaim input[data-field="billAmount"]').val('');
			$('#calculateClaim input[data-field="billNumber"]').val('');
			$('#billsTableUpdateButton').css('display', 'none');
			$('#billsTableAddButton').css('display', 'block');
		}, function errorCallback(error) {
			globals.showToastMessage('Error', error, 'error');
		});
	}
});

$('#calculateClaimButton').on('click', function() {
	$('#calculationSection').css('display', 'none');
	$('#calculationResult').css('display', 'block');
	$('#topResult').click();

    doa = new Date(doa);
    var doaTime = doa.getTime();

    dod = new Date(dod);
    var dodTime = dod.getTime();

    var preHospitalizationExpenses = 0;
    var postHospitalizationExpenses = 0;
    var hospitalizationExpenses = 0;
    var totalHospitalizationExpenses
    var pharmacy = 0;
    var bloodTotal = 0;
    var hospitalMainBill = 0;
    var preHospitalizationDays = 0;
    var postHospitalizationDays = 0;


    for (var i = 0; i < billsData.length; i++) {
        var billDate = new Date(billsData[i].billDate);
        var billDateTime = billDate.getTime();

        if (billsData[i].billType =='Pharmacy') {
            pharmacy += billsData[i].billAmount;
        }
        if (billsData[i].billType == 'Hospital Bill') {
            hospitalMainBill += billsData[i].billAmount;
        }

        if (billDateTime < doaTime) {
            preHospitalizationExpenses += billsData[i].billAmount;
            preHospitalizationDays = daysDifference(doaTime,billDateTime);
        } else if (billDateTime > dodTime) {
            postHospitalizationExpenses += billsData[i].billAmount;
            postHospitalizationDays = daysDifference(dodTime,billDateTime);
        } else {
            hospitalizationExpenses += billsData[i].billAmount;
        }
    } 

    totalHospitalizationExpenses = preHospitalizationExpenses
           + postHospitalizationExpenses
           + hospitalizationExpenses;
    var totalBills = billsData.length;

    $('#calculationResult span[data-field="preHospitalizationExpenses"]').text(preHospitalizationExpenses);
    $('#calculationResult span[data-field="postHospitalizationExpenses"]').text(postHospitalizationExpenses);
    $('#calculationResult span[data-field="hospitalizationExpenses"]').text(hospitalizationExpenses);
    $('#calculationResult span[data-field="totalHospitalizationExpenses"]').text(totalHospitalizationExpenses);
    $('#calculationResult span[data-field="preHospitalizationDays"]').text(preHospitalizationDays);
    $('#calculationResult span[data-field="postHospitalizationDays"]').text(postHospitalizationDays);

    $('#claimCalculatorResultBillTable tbody').empty();
    var sNo = 1;

    switch(totalBills) {
    	case 1: {
    		var row = '<tr>';
			row += '<td>' + sNo + '</td>';
			row += '<td>' + billsData[0].billNumber + '</td>';
			row += '<td>' + dateFormat(billsData[0].billDate) + '</td>';
			row += '<td> </td>';
			row += '<td>Hospital Main Bill</td>';
			row += '<td>' + hospitalMainBill + '</td>';
			row += '</tr>';

			row += '<tr>';
			row += '<td>2 </td>';
			row += '<td> </td>';
			row += '<td> </td>';
			row += '<td> </td>';
			row += '<td>Pre-hospitalization Bills: </td>';
			row += '<td>' + preHospitalizationExpenses + '</td>';
			row += '</tr>';

			row += '<tr>';
			row += '<td>3 </td>';
			row += '<td> </td>';
			row += '<td> </td>';
			row += '<td> </td>';
			row += '<td>Post-hospitalization Bills:</td>';
			row += '<td>' + postHospitalizationExpenses + '</td>';
			row += '</tr>';

			row += '<tr>';
			row += '<td> 4</td>';
			row += '<td> </td>';
			row += '<td> </td>';
			row += '<td> </td>';
			row += '<td>Pharmacy Bills: </td>';
			row += '<td>' + pharmacy + '</td>';
			row += '</tr>';

			row += '<tr>';
			row += '<td>5 </td>';
			row += '<td> </td>';
			row += '<td> </td>';
			row += '<td> </td>';
			row += '<td class="highlighted">Total</td>';
			row += '<td class="highlighted">' + totalHospitalizationExpenses + '</td>';
			row += '</tr>';

			$('#claimCalculatorResultBillTable tbody').append(row);
			break;
    	};
    	case 2: {
    		var row = '<tr>';
			row += '<td>' + sNo + '</td>';
			row += '<td>' + billsData[0].billNumber + '</td>';
			row += '<td>' + dateFormat(billsData[0].billDate) + '</td>';
			row += '<td> </td>';
			row += '<td>Hospital Main Bill</td>';
			row += '<td>' + hospitalMainBill + '</td>';
			row += '</tr>';

			row += '<tr>';
			row += '<td>2 </td>';
			row += '<td>' + billsData[1].billNumber + '</td>';
			row += '<td>' + dateFormat(billsData[1].billDate) + '</td>';
			row += '<td> </td>';
			row += '<td>Pre-hospitalization Bills: </td>';
			row += '<td>' + preHospitalizationExpenses + '</td>';
			row += '</tr>';

			row += '<tr>';
			row += '<td>3 </td>';
			row += '<td> </td>';
			row += '<td> </td>';
			row += '<td> </td>';
			row += '<td>Post-hospitalization Bills:</td>';
			row += '<td>' + postHospitalizationExpenses + '</td>';
			row += '</tr>';

			row += '<tr>';
			row += '<td> 4</td>';
			row += '<td> </td>';
			row += '<td> </td>';
			row += '<td> </td>';
			row += '<td>Pharmacy Bills: </td>';
			row += '<td>' + pharmacy + '</td>';
			row += '</tr>';

			row += '<tr>';
			row += '<td>5 </td>';
			row += '<td> </td>';
			row += '<td> </td>';
			row += '<td> </td>';
			row += '<td class="highlighted">Total</td>';
			row += '<td class="highlighted">' + totalHospitalizationExpenses + '</td>';
			row += '</tr>';

			$('#claimCalculatorResultBillTable tbody').append(row);
			break;
    	};
    	case 3: {
    		var row = '<tr>';
			row += '<td>' + sNo + '</td>';
			row += '<td>' + billsData[0].billNumber + '</td>';
			row += '<td>' + dateFormat(billsData[0].billDate) + '</td>';
			row += '<td> </td>';
			row += '<td>Hospital Main Bill</td>';
			row += '<td>' + hospitalMainBill + '</td>';
			row += '</tr>';

			row += '<tr>';
			row += '<td>2 </td>';
			row += '<td>' + billsData[1].billNumber + '</td>';
			row += '<td>' + dateFormat(billsData[1].billDate) + '</td>';
			row += '<td> </td>';
			row += '<td>Pre-hospitalization Bills: </td>';
			row += '<td>' + preHospitalizationExpenses + '</td>';
			row += '</tr>';

			row += '<tr>';
			row += '<td>3 </td>';
			row += '<td>' + billsData[2].billNumber + '</td>';
			row += '<td>' + dateFormat(billsData[2].billDate) + '</td>';
			row += '<td> </td>';
			row += '<td>Post-hospitalization Bills:</td>';
			row += '<td>' + postHospitalizationExpenses + '</td>';
			row += '</tr>';

			row += '<tr>';
			row += '<td> 4</td>';
			row += '<td> </td>';
			row += '<td> </td>';
			row += '<td> </td>';
			row += '<td>Pharmacy Bills: </td>';
			row += '<td>' + pharmacy + '</td>';
			row += '</tr>';

			row += '<tr>';
			row += '<td>5 </td>';
			row += '<td> </td>';
			row += '<td> </td>';
			row += '<td> </td>';
			row += '<td class="highlighted">Total</td>';
			row += '<td class="highlighted">' + totalHospitalizationExpenses + '</td>';
			row += '</tr>';

			$('#claimCalculatorResultBillTable tbody').append(row);
			break;
    	};
    	case 4: {
    		var row = '<tr>';
			row += '<td>' + sNo + '</td>';
			row += '<td>' + billsData[0].billNumber + '</td>';
			row += '<td>' + dateFormat(billsData[0].billDate) + '</td>';
			row += '<td> </td>';
			row += '<td>Hospital Main Bill</td>';
			row += '<td>' + hospitalMainBill + '</td>';
			row += '</tr>';

			row += '<tr>';
			row += '<td>2 </td>';
			row += '<td>' + billsData[1].billNumber + '</td>';
			row += '<td>' + dateFormat(billsData[1].billDate) + '</td>';
			row += '<td> </td>';
			row += '<td>Pre-hospitalization Bills: </td>';
			row += '<td>' + preHospitalizationExpenses + '</td>';
			row += '</tr>';

			row += '<tr>';
			row += '<td>3 </td>';
			row += '<td>' + billsData[2].billNumber + '</td>';
			row += '<td>' + dateFormat(billsData[2].billDate) + '</td>';
			row += '<td> </td>';
			row += '<td>Post-hospitalization Bills:</td>';
			row += '<td>' + postHospitalizationExpenses + '</td>';
			row += '</tr>';

			row += '<tr>';
			row += '<td> 4</td>';
			row += '<td>' + billsData[3].billNumber + '</td>';
			row += '<td>' + dateFormat(billsData[3].billDate) + '</td>';
			row += '<td> </td>';
			row += '<td>Pharmacy Bills: </td>';
			row += '<td>' + pharmacy + '</td>';
			row += '</tr>';

			row += '<tr>';
			row += '<td>5 </td>';
			row += '<td> </td>';
			row += '<td> </td>';
			row += '<td> </td>';
			row += '<td class="highlighted">Total</td>';
			row += '<td class="highlighted">' + totalHospitalizationExpenses + '</td>';
			row += '</tr>';

			$('#claimCalculatorResultBillTable tbody').append(row);
			break;
    	};
    	default: {
    		for (var i = 0; i < billsData.length; i++) {
	    		var row = '<tr>';
				row += '<td>' + sNo + '</td>';
				row += '<td>' + billsData[i].billNumber + '</td>';
				row += '<td>' + dateFormat(billsData[i].billDate) + '</td>';
				row += '<td> </td>';
				switch(i) {
					case 0: {
						row += '<td>Hospital Main Bill</td>';
						row += '<td>' + hospitalMainBill + '</td>';
						break;
					};
					case 1: {
						row += '<td>Pre-hospitalization Bills: </td>';
						row += '<td>' + preHospitalizationExpenses + '</td>';
						break;
					};
					case 2: {
						row += '<td>Post-hospitalization Bills: </td>';
						row += '<td>' + postHospitalizationExpenses + '</td>';
						break;
					};
					case 3: {
						row += '<td>Pharmacy Bills: </td>';
						row += '<td>' + pharmacy + '</td>';
						break;
					};
					case 4: {
						row += '<td class="highlighted">Total: </td>';
						row += '<td class="highlighted">' + totalHospitalizationExpenses + '</td>';
						break;
					};
					default: {
						row += '<td></td>';
						row += '<td></td>';
						break;
					}
				}
				row += '</tr>';
				sNo++;
				$('#claimCalculatorResultBillTable tbody').append(row);
			}
			break;
		};
    }
});

$('#emailSendButton').on('click', function() {
	$('#emailInputSuccess').css('display','none');
	var emailId = $('#emailInput').val();
	var hasError = false;
	if (emailId == '') {
		hasError = true;
		$('#emailInputError').css('display', 'block');
		$('#emailInputError').text('Please enter your email address');
		setTimeout(function() {
			$('#emailInputError').fadeOut('slow');
		}, 4000);
	} else if (!/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z]{2,4})+$/g.test(emailId)) {
		hasError = true;
		$('#emailInputError').css('display', 'block');
		$('#emailInputError').text('Please enter correct email address');
		setTimeout(function() {
			$('#emailInputError').fadeOut('slow');
		}, 4000);
	}
	if (!hasError) {
		$('#emailInputSuccess').css('display','block');
		$('#emailInputSuccess').text('Email has been sent successfully.');
	}
});

function daysDifference(date1, date2) {
    var timeDiff = Math.abs(date2 - date1);
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return diffDays;
}

function dateFormat(date) {
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
        return [day, month, year].join('/');
    } else {
        return '';
    }
}

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