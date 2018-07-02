/**
 * @author Manoj Kumar<manojswami600@gmail.com>
 */

// Global variables
var proformaId;
var ssid;
var proformaErrors = $('#proformaErrors');
var totalServices = 0;
var totalPayments = 0;
var discountAmount = 0;
var writeOffAmount = 0;

$(document).ready(function() {
	$('#serviceSection').css('display', 'none');
	$('#userSection').css('display', 'none');
	$('#serviceSectionTable').css('display', 'none');
	$('#paymentsTable').css('display', 'none');
	$('.proforma-total').css('display', 'none');
	$('#writeOffMessage').css('display', 'none');
	$('#discountMessage').css('display', 'none');

	// Get all services and display in drop-down
	getAllServices();

	// Search user
	$('#searchUser').on('click', function() {

		var searchName = $('#searchProformaUser input[data-field="searchName"]').val();
		var searchNumber = $('#searchProformaUser input[data-field="searchNumber"]').val();

		if (searchNumber == '') {
			$('#searchNumberError').css('display','block');
			$('#searchNumberError').text('Please enter mobile number');
			setTimeout(function() {
				$('#searchNumberError').fadeOut('slow');
			}, 5000);
		} else if (!searchNumber.match(/^\d{10}$/)) {
			$('#searchNumberError').css('display','block');
			$('#searchNumberError').text('Please enter valid 10 digit number');
			setTimeout(function() {
				$('#searchNumberError').fadeOut('slow');
			}, 5000);
		} else {
			searchProformaUser();
		}
	});
}); 

// Search User
var searchProformaUser = function() {
	var params = {};
	params.searchName = $('#searchProformaUser input[data-field="searchName"]').val();
	params.searchNumber = $('#searchProformaUser input[data-field="searchNumber"]').val();

	globals.ajaxService.searchProformaUser(params, function successCallback(userData) {
		setUserData(userData);
		if (userData != null) {
			ssid = userData.ssid;
		}
		$('#searchUser').prop('disabled', 'true');
	}, function errorCallback(message) {
		globals.showToastMessage('Error', message, 'error');
	});
};

// Add new user validation
$('#addNewUser').on('click', function() {
	var newUserName = $('#createProforma input[data-field="userName"]').val();
	var newUserMobile = $('#createProforma input[data-field="userMobile"]').val();
	var newUserEmail = $('#createProforma input[data-field="userEmail"]').val();

	if (newUserName != '') {
		if (!/^[a-zA-Z]+(\s{0,1}[a-zA-Z ])*$/g.test(newUserName)) {
			$('#userNameError').css('display', 'block');
			$('#userNameError').text('Please enter valid name');
			setTimeout(function() {
				$('#userNameError').fadeOut('slow');
			}, 5000);
		}
	} else if (newUserMobile == '') {
		$('#userMobileError').css('display', 'block');
		$('#userMobileError').text('Please provide user mobile number');
		setTimeout(function() {
			$('#userMobileError').fadeOut('slow');
		}, 5000);
	} else if (!newUserMobile.match(/^\d{10}$/)) {
		$('#userMobileError').css('display', 'block');
		$('#userMobileError').text('Please enter correct mobile number');
		setTimeout(function() {
			$('#userMobileError').fadeOut('slow');
		}, 5000);
	} else if (newUserEmail != '') {
		if (!/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z]{2,4})+$/g.test(newUserEmail)) {
			$('#userEmailError').css('display', 'block');
			$('#userEmailError').text('Please enter correct email address');
			setTimeout(function() {
				$('#userEmailError').fadeOut('slow');
			}, 5000);
		}
		
	} else {
		addNewUser();
	}
});

// Add new user to db
var addNewUser = function() {
	var newAddedMobile = $('#createProforma input[data-field="userMobile"]').val();
	var params = {};
	params.name = $('#createProforma input[data-field="userName"]').val();
	params.mobile = $('#createProforma input[data-field="userMobile"]').val();
	params.email = $('#createProforma input[data-field="userEmail"]').val();

	globals.ajaxService.addUser(params, function successCallback(newUser) {
		ssid = newUser.ssid;
		globals.showToastMessage('Success', 'Added new User' , 'success');
		userAddedSuccess();
		createNewProforma(newUser.ssid);
	}, function errorCallback(message) {
		globals.showToastMessage('Error', 'User already exist with this mobile number', 'error');
	});
};

function userAddedSuccess() {
	$('#createProforma input[data-field="userMobile"]').prop("disabled", true);
	$('#userResult').css("display", "none");
	$('#serviceSection').css("display", "block");
}

var getUserSsidSearch = function() {
	var params = {};
	params.mobile = $('#searchProformaUser input[data-field="searchNumber"]').val();
	globals.ajaxService.getUserSsid(params, function successCallback(userId) {
		createNewProforma(userId.ssid);
	}, function errorCallback(message) {
		globals.showToastMessage('Error', message, 'error');
	});
};

function createNewProforma(ssid) {
	var params = {};
	params.ssid = ssid;
	globals.ajaxService.createNewProforma(params, function successCallback(userId) {
		proformaId = userId.id;
	}, function errorCallback(message) {
		globals.showToastMessage('Error', 'User already exist with this mobile number', 'error');
	});
}

var getAllServices = function() {
	var params = {};
	globals.ajaxService.getAllServices(params, function successCallback(selfClaims) {
		displayAllServices(selfClaims);
	}, function errorCallback(message) {
		globals.showToastMessage('Error', message, 'error');
	});
};

// Display all services in options
function displayAllServices(services) {

	var serviceInput = '';
	serviceInput += "<option  selected='true' id='0' disabled='disabled'>Select Service</option>";
	for(var i = 0; i < services.length; i++) {
		serviceInput += "<option value='" + services[i].price + "' id='" + services[i].id + "''>" + services[i].serviceName + "</option>";
	}
	$( 'select[name="serviceInput"]' ).append( serviceInput );
}

// Add new service
$('#addProformaService').on('click', function() {
	var selectedId = $('#serviceNameSelect').children(":selected").attr("id");
	var price = $('#createProforma input[data-field="servicePrice"]').val();
	var serviceQty = $('#createProforma input[data-field="serviceQty"]').val();
	var hasError = false;
	var Totalprice;
	if (selectedId == '0') {
		hasError = true;
		$('#serviceNameError').css("display", "block");
		$('#serviceNameError').text('Please select one service');
		setTimeout(function() {
			$('#serviceNameError').fadeOut('slow');
		}, 5000);
	} else if (serviceQty == '' || serviceQty == '0') {
		hasError = true;
		$('#serviceQtyError').css("display", "block");
		$('#serviceQtyError').text('Please enter service quantity');
		setTimeout(function() {
			$('#serviceQtyError').fadeOut('slow');
		}, 5000);
	} else if (price == '0') {
		hasError = true;
		$('#servicePriceError').css("display", "block");
		$('#servicePriceError').text('Service price should not be Zero');
		setTimeout(function() {
			$('#servicePriceError').fadeOut('slow');
		}, 5000);
	} 

	if (!hasError) {

		Totalprice = price * serviceQty;
		var serviceData = {};
		serviceData.proformaId = proformaId;
		serviceData.serviceId = selectedId;
		serviceData.servicePrice = Totalprice;
		serviceData.serviceQty = serviceQty;

		checkProformaService(serviceData);
	}
});

function checkProformaService(serviceData) {
	var params = serviceData;
	globals.ajaxService.checkProformaService(params, function successCallback(services) {
		addProformaService(serviceData);
		// console.log(services);
		// console.log(services.length);
		// if (services.length == 0 ) {
		// 	addProformaService(serviceData);
		// }
	}, function errorCallback(error) {
		globals.showToastMessage('Error', error, 'error')
	});
}

function addProformaService(serviceData) {
	var params = serviceData;
	globals.ajaxService.addProformaService(params, function successCallback(services) {
		showServicesTable();
		$('#createProforma input[data-field="servicePrice"]').val('');
		$('#createProforma input[data-field="serviceQty"]').val('');
	}, function errorCallback(error) {
		globals.showToastMessage('Error', error, 'error')
	});
}

// Display all added services
function showServicesTable() {
	var params = {};
	params.proformaId = proformaId;
	globals.ajaxService.displayProformaServices(params, function successCallback(services) {
		totalServices = services.length;
		if (services.length == 0) {
			$('#serviceSectionTable').css('display', 'none');
		} else {
			$('#serviceSectionTable').css('display', 'block');
		}
		servicesTable(services);
	}, function errorCallback(error) {
		globals.showToastMessage('Error', error, 'error');
	});
}

// Display all services in table
function servicesTable(services) {
	console.log(services);

	var sNo = 1;
	var totalServicesPrice = 0;
	$('#proformaServicesTable tbody').empty();

	for(var i = 0; i < services.length; i++) {
		totalServicesPrice = services[i].updatedPrice + totalServicesPrice;
		var row = '<tr>';
		row += '<td>' +sNo+ '</td>';
		row += '<td>' +services[i].service.serviceName+ '</td>';
		row += '<td>' +services[i].quantity+ '</td>';
		row += '<td>' +services[i].updatedPrice+ '</td>';
		row += '<td><i class="trash alternate outline icon delete-button" title="Delete"' 
                + 'onClick="deleteServiceButtonClicked(' + services[i].id + ');"></i></td>';
		row += '</tr>';
		sNo++;
		$('#proformaServicesTable tbody').append(row);
	}
	$('#totalServicesPrice').text(totalServicesPrice);
	$('#totalNumberServices').text(services.length);
	$('#proformaAmountFinal').text(totalServicesPrice);
}

function deleteServiceButtonClicked(id) {
	var params = {};
	params.id = id;
	globals.ajaxService.deleteProformaService(params, function successCallback(success) {
		globals.showToastMessage('Success', 'Service Deleted', 'success');
		showServicesTable();
	}, function errorCallback(error) {
		globals.showToastMessage('Error', error, 'error')
	})
}

$('#addProformaPayment').on('click', function() {
	var paymentAmount = $('#createProforma input[data-field="paymentAmount"]').val();
	var paymentDate = $('#createProforma input[data-field="paymentDate"]').val();
	var receivedBy = $('#createProforma input[data-field="receivedBy"]').val();
	var paymentMode = $('#selectedPaymentMode').val();
	var hasError = false;

	if (paymentAmount == '' || paymentAmount == '0') {
		hasError = true;
		$('#paymentAmountError').css('display', 'block');
		$('#paymentAmountError').text('Please enter payment amount');
		setTimeout(function() {
			$('#paymentAmountError').fadeOut('slow');
		}, 4000);
	} else if (paymentDate == '') {
		hasError = true;
		$('#paymentDateError').css('display', 'block');
		$('#paymentDateError').text('Please select payment date');
		setTimeout(function() {
			$('#paymentDateError').fadeOut('slow');
		}, 4000);
	} else if (paymentMode == null) {
		hasError = true;
		$('#paymentModeError').css('display', 'block');
		$('#paymentModeError').text('Please select payment mode');
		setTimeout(function() {
			$('#paymentModeError').fadeOut('slow');
		}, 4000);
	}

	if (!hasError) {
		var paymentData = {};
		paymentData.amount = paymentAmount;
		paymentData.receivedDate = paymentDate;
		paymentData.paymentMode = paymentMode;
		paymentData.receivedBy = receivedBy;
		paymentData.proformaId = proformaId;
		addProformaPayment(paymentData);
	}
});

function addProformaPayment(data) {
	var params = data;
	globals.ajaxService.addProformaPayment(params, function successCallback(result) {
		globals.showToastMessage('Success', 'Payment Added', 'success');
		$('#createProforma input[data-field="paymentAmount"]').val('');
		$('#createProforma input[data-field="paymentDate"]').val('');
		$('#createProforma input[data-field="receivedBy"]').val('');
		$('#selectedPaymentMode').val('0');
		getProformaPayments();
	}, function errorCallback(error) {
		globals.showToastMessage('Error', error, 'error');
	});
}

function getProformaPayments() {
	var params = {};
	params.proformaId = proformaId;
	globals.ajaxService.getProformaPayments(params, function successCallback(result) {
		
		if (result.length != 0) {
			$('#paymentsTable').css('display', 'block');
			$('.proforma-total').css('display', 'block');
		} else {
			$('#paymentsTable').css('display', 'none');
			$('.proforma-total').css('display', 'none');
		}
		proformaPaymentsTable(result);
	}, function errorCallback(error) {
		globals.showToastMessage('Error', error, 'error');
	});
}

function proformaPaymentsTable(tables) {

	var sNo = 1;
	var totalPayments = 0;

	$('#proformaPaymentsTable tbody').empty();
	
	for (var i = 0; i < tables.length; i++) {

		totalPayments = tables[i].amount + totalPayments;
		var row = '<tr>';
		row += '<td>' +sNo+ '</td>';
		row += '<td>' +tables[i].amount+ '</td>';
		row += '<td>' +tables[i].paymentMode+ '</td>';
		row += '<td>' +new Date(tables[i].receivedDate).toDateString()+ '</td>';
		row += '<td>' +tables[i].receivedBy+ '</td>';
		row += '<td><i onclick="deletePaymentButtonClicked(' +tables[i].id+ ')" class="trash alternate outline icon delete-button" title="Delete"></i></td>';
		row += '<tr>';
		sNo++;
		$('#proformaPaymentsTable tbody').append(row);
	}
	$('#totalPayments').text(totalPayments);
	$('#totalNumberPayments').text(tables.length);
	$('#proformaPaymentFinal').text(totalPayments);
}

function deletePaymentButtonClicked(id) {
	var params = {};
	params.id = id;
	globals.ajaxService.deleteProformaPayment(params, function successCallback(success) {
		globals.showToastMessage('Success', 'Payment Deleted', 'success');
		getProformaPayments();
	}, function errorCallback(error) {
		globals.showToastMessage('Error', error, 'error');
	});
}

// Action after user search 
function setUserData(users) {
	
	if (users == null) {
		var userEnteredNumber = $('#searchProformaUser input[data-field="searchNumber"]').val();
		$('#userSection').css("display", "block");
		$('#serviceSection').css("display", "none");
		$('#createProforma input[data-field="userMobile"]').val(userEnteredNumber);
		$('#createProforma input[data-field="userName"]').val('');
		$('#createProforma input[data-field="userEmail"]').val('');
		$('#userResult').css("display", "block");
		$('#userResult').text('No user registered with this number');
		$('#createProforma input[data-field="userMobile"]').prop("disabled", false);
		$('#createProforma input[data-field="userName"]').prop("disabled", false);
		$('#addNewUser').css("display", "block");
	} else {
		getUserSsidSearch();
		if (users.name == '') {
			$('#createProforma input[data-field="userName"]').prop("disabled", false);
		} else {
			$('#createProforma input[data-field="userName"]').prop("disabled", true);
		}
		if (users.email == '') {
			$('#createProforma input[data-field="userEmail"]').prop("disabled", false);
		} else {
			$('#createProforma input[data-field="userEmail"]').prop("disabled", true);
		}
		$('#userSection').css("display", "block");
		$('#serviceSection').css("display", "block");
		$('#createProforma input[data-field="userMobile"]').val(users.mobile);
		$('#createProforma input[data-field="userName"]').val(users.name);
		$('#createProforma input[data-field="userEmail"]').val(users.email);
		$('#createProforma input[data-field="userMobile"]').prop("disabled", true);
		$('#addNewUser').css("display", "none");
		$('#userResult').css("display", "none");
	}
}

// Apply Discount
$('#discountAmountButton').on('click', function() {
	var hasError = false;
	discountAmount = $('#createProforma input[data-field="discountAmount"]').val();
	if (discountAmount == '') {
		hasError = true;
		$('#discountAmountError').css('display', 'block');
		$('#discountAmountError').text('Please enter some amount');
	} else if (totalServices == 0) {
		hasError = true;
		$('#discountAmountError').css('display', 'block');
		$('#discountAmountError').text('First add some services');
	}
	if (!hasError) {
		$('#discountAmountError').css('display', 'none');
		$('#discountMessage').css('display', 'block');
		$('#discountAmountFinal').text(discountAmount);
	}
});

// Apply Write-off
$('#writeOffAmountButton').on('click', function() {
	var hasError = false;
	writeOffAmount = $('#createProforma input[data-field="writeOffAmount"]').val();
	if (writeOffAmount == '') {
		hasError = true;
		$('#writeOffAmountError').css('display', 'block');
		$('#writeOffAmountError').text('Please enter some amount');
	} else if (totalServices == 0) {
		hasError = true;
		$('#writeOffAmountError').css('display', 'block');
		$('#writeOffAmountError').text('First add some services');
	}
	if (!hasError) {
		$('#writeOffAmountError').css('display', 'none');
		$('#writeOffMessage').css('display', 'block');
		$('#witeOffAmountFinal').text(writeOffAmount);
	}
});

// Update proforma
$('#createProformaButton').on('click', function() {
	var proformaDate = $('#createProforma input[data-field="proformaDate"]').val();
	var patientName = $('#createProforma input[data-field="patientName"]').val();
	var proformaComment = $('#createProforma input[data-field="proformaComment"]').val();
	//console.log(proformaDate,paymentAmount,paymentDate,paymentMode,totalServices);
	 var proformaErrors = '';
	$('#proformaErrors').empty();
	var hasError = false;

	if (patientName == '') {
		hasError = true;
		proformaErrors += '<p>Please write patient name</p>';
	} 
	if (proformaDate == '') {
		hasError = true;
		proformaErrors += '<p>Please select proforma date</p>';
	} 
	if (totalServices == '' || totalServices == '0') {
		hasError = true;
		proformaErrors += '<p>Please add some services</p>';
	}
	$('#proformaErrors').append(proformaErrors);

	if (!hasError) {
		var proformaData = {};
		proformaData.patientName = patientName;
		proformaData.proformaDate = proformaDate;
		proformaData.discountAmount = discountAmount;
		proformaData.writeOffAmount = writeOffAmount;
		proformaData.proformaComment = proformaComment;
		proformaData.proformaId = proformaId;
		console.log(proformaData);
		saveProforma(proformaData);
	}
});

function saveProforma(proformaData) {
	var params = proformaData;
	globals.ajaxService.saveProforma(params, function successCallback(data) {
		console.log(data);
		globals.showToastMessage('Success', 'Updated', 'success');
	}, function errorCallback(error) {
		globals.showToastMessage('Error', error, 'error');
	});
}
