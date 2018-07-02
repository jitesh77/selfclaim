/**
 * @author Manoj Kumar<manojswami600@gmail.com>
 */

'use-strict';

$(document).ready(function() {
	var proformaId = invoiceData.id;
	getServices();
	getPayments();

	$("#invoiceDate span[data-field=invoiceNumber").text();
	$("#invoiceDate span[data-field=invoiceDate").text();

	function getServices() {
		var params = {};
		params.proformaId = proformaId;
		globals.ajaxService.displayProformaServices(params, function successCallback(services) {
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
		$('#servicesTable tbody').empty();

		for(var i = 0; i < services.length; i++) {
			totalServicesPrice = services[i].updatedPrice + totalServicesPrice;
			var row = '<tr>';
			row += '<td>' +sNo+ '</td>';
			row += '<td>' +services[i].service.serviceName+ '</td>';
			row += '<td>' +services[i].quantity+ '</td>';
			row += '<td>' +services[i].updatedPrice+ '</td>';
			row += '</tr>';
			sNo++;
			$('#servicesTable tbody').append(row);
		}
		//$('#totalServicesPrice').text(totalServicesPrice);
	}

	function getPayments() {
		var params = {};
		params.proformaId = proformaId;
		globals.ajaxService.getProformaPayments(params, function successCallback(result) {
			proformaPaymentsTable(result);
		}, function errorCallback(error) {
			globals.showToastMessage('Error', error, 'error');
		});
	}

	function proformaPaymentsTable(tables) {

		var sNo = 1;
		var totalPayments = 0;

		$('#paymentsTable tbody').empty();
		
		for (var i = 0; i < tables.length; i++) {

			totalPayments = tables[i].amount + totalPayments;
			var row = '<tr>';
			row += '<td>' +sNo+ '</td>';
			row += '<td>' +tables[i].amount+ '</td>';
			row += '<td>' +tables[i].paymentMode+ '</td>';
			row += '<td>' +new Date(tables[i].receivedDate).toDateString()+ '</td>';
			row += '<tr>';
			sNo++;
			$('#paymentsTable tbody').append(row);
		}
		//$('#totalPayments').text(totalPayments);
	}


});