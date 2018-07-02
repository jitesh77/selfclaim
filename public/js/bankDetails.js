/**
 * @author Manoj Kumar<manojswami600@gmail.com>
 */


'use-strict';

$(document).ready(function() {
	// pre-populating bank details if saved in localStorage
	var bankDetails = globals.localStorageService
			.getItem(globals.constants.BANK_DETAILS_LOCAL_STORAGE_KEY);
	if (bankDetails) {
		$('#finalizeTabForm input[data-field="bankName"]')
		        .val(bankDetails.bankName);
		$('#finalizeTabForm input[data-field="accountNumber"]')
		        .val(bankDetails.accountNumber);
		$('#finalizeTabForm input[data-field="nameAsPerBankRecord"]')
		        .val(bankDetails.nameAsPerBankRecord);
		$('#finalizeTabForm input[data-field="ifscCode"]')
		        .val(bankDetails.ifscCode);
		$('#finalizeTabForm input[data-field="panNumber"]')
		        .val(bankDetails.panNumber);
	}

	$('#downloadClaimFormButton').on('click', function() {
		var hasError = false;
		var bankName = $('#finalizeTabForm input[data-field="bankName"]').val();
		var accountNumber = $('#finalizeTabForm input[data-field="accountNumber"]').val();
		var nameAsPerBankRecord = $('#finalizeTabForm input[data-field="nameAsPerBankRecord"]').val();
		var ifscCode = $('#finalizeTabForm input[data-field="ifscCode"]').val();
		var panNumber = $('#finalizeTabForm input[data-field="panNumber"]').val();

		if (bankName == '') {
			$('#bankName').html('Please provide your Bank Name');
			hasError = true;
		} else if (!/^[a-zA-Z]+(\s{0,1}[a-zA-Z .])*$/g.test(bankName)) {
			hasError = true;
			$('#bankName').css('display','block');
			$('#bankName').text('Please enter correct bank Name');
			setTimeout(function() {
				$('#bankName').fadeOut('slow');
			}, 3000);
		} else if (accountNumber == '') {
			hasError = true;
			$('#accountNumber').css('display','block');
			$('#accountNumber').text('Please provide your Bank Account Number');
			setTimeout(function() {
				$('#accountNumber').fadeOut('slow');
			}, 3000);
		} else if (nameAsPerBankRecord == '') {
			hasError = true;
			$('#nameAsPerBankRecord').css('display','block');
			$('#nameAsPerBankRecord').text('Please provide your Name as per bank records');
			setTimeout(function() {
				$('#nameAsPerBankRecord').fadeOut('slow');
			}, 3000);
		} else if (!/^[a-zA-Z]+(\s{0,1}[a-zA-Z .])*$/g.test(nameAsPerBankRecord)) {
			hasError = true;
			$('#nameAsPerBankRecord').css('display','block');
			$('#nameAsPerBankRecord').text('Please enter correct Name');
			setTimeout(function() {
				$('#nameAsPerBankRecord').fadeOut('slow');
			}, 3000);
		} else if (ifscCode == '') {
			hasError = true;
			$('#ifscCode').css('display','block');
			$('#ifscCode').text('Please provide IFSC code');
			setTimeout(function() {
				$('#ifscCode').fadeOut('slow');
			}, 3000);
		} else if (!/^[A-Za-z]{4}\d{7}$/g.test(ifscCode)) {
			hasError = true;
			$('#ifscCode').css('display','block');
			$('#ifscCode').text('Please enter valid IFSC code');
			setTimeout(function() {
				$('#ifscCode').fadeOut('slow');
			}, 3000);
		} else if (panNumber != '') {
			if (!/[A-Z]{5}[0-9]{4}[A-Z]{1}$/g.test(panNumber)) {
			    hasError = true;				
				$('#panNumber').css('display','block');
				$('#panNumber').text('Please enter valid PAN Number');
				setTimeout(function() {
					$('#panNumber').fadeOut('slow');
				}, 3000);
			}
		} 
		if (!hasError) {
			// save details to localStorage
			bankDetails = {
				bankName: bankName,
				accountNumber: accountNumber,
				nameAsPerBankRecord: nameAsPerBankRecord,
				ifscCode: ifscCode,
				panNumber: panNumber
			}

			globals.localStorageService
			        .setItem(globals.constants.BANK_DETAILS_LOCAL_STORAGE_KEY, bankDetails);

			var selfClaimDetails = globals.localStorageService
			        .getItem(globals.constants.SELF_CLAIM_DETAILS_LOCAL_STORAGE_KEY);
			var insurerId = selfClaimDetails.insurerId;
			var tpaId = selfClaimDetails.tpaId;

			window.location = 'dashboard/download-pdf?insurerId='
			        + insurerId + '&tpaId=' + tpaId;
		}
	});
});
