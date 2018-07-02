/**
 * @author Varun Kumar<varunon9@gmail.com>
 * https://github.com/varunon9
 * Date: 18 April, 2018
 */

function getUsers(callback) {
    var params = {};
    globals.ajaxService.getUsers(params, function successCallback(users) {
        callback(users);
    }, function errorCallback(message) {
        globals.showToastMessage('Error', message, 'error');
    });
}

function getSelfClaims(callback) {
    var params = {};
    globals.ajaxService.getSelfClaims(params, function successCallback(selfClaims) {
        callback(selfClaims);
    }, function errorCallback(message) {
        globals.showToastMessage('Error', message, 'error');
    });
}

function getAdminProfile(callback) {
    var params = {};
    globals.ajaxService.getAdminProfile(params, function successCallback(admin) {
        callback(admin);
    }, function errorCallback(message) {
        globals.showToastMessage('Error', message, 'error');
    });
}

function showServices() {
    globals.ajaxService.getAdminServices({}, function successCallback(result) {
        updateServicesTable(result);
    }, function failureCallback(message) {
        globals.showToastMessage('Error', message, 'error');
    });
}

function getAllProformas(sort) {
    var params = {};
    params.sortBy = sort;
    globals.ajaxService.getAllProformas(params, function successCallback(result) {
        proformaTable(result);
    }, function failureCallback(message) {
        globals.showToastMessage('Error', message, 'error');
    });
}

function deleteProformaButtonClicked(id) {
    var response = confirm("Are you sure, you want to delete this proforma???");
    if (response == true) {
        var params = {};
        params.id = id;
        globals.ajaxService.deleteProforma(params, function successCallback(selfClaims) {
            globals.showToastMessage('Success', 'Proforma Deleted', 'success');
            getAllProformas();
        }, function errorCallback(message) {
            globals.showToastMessage('Error', message, 'error');
        });
    } else {
        return false;
    }
}

function proformaSort(value) {
    getAllProformas(value);
}

var addNewService = function() {
    var params = {};
    params.serviceName = $('#adminServices input[data-field="serviceName"]').val();
    params.serviceType = $('#adminServices input[data-field="serviceType"]').val();
    params.servicePrice = $('#adminServices input[data-field="servicePrice"]').val();

    globals.ajaxService.addNewService(params, function successCallback(selfClaims) {
        globals.showToastMessage('Success', 'New service created', 'success');
        getServices();
        $('#adminServices input[data-field="serviceName"]').val('');
        $('#adminServices input[data-field="serviceType"]').val('');
        $('#adminServices input[data-field="servicePrice"]').val('');    
    }, function errorCallback(message) {
        globals.showToastMessage('Error', message, 'error');
    });
}

function getServices() {
    globals.ajaxService.getAdminServices({}, function successCallback(result) {
        updateServicesTable(result);
    }, function failureCallback(message) {
        globals.showToastMessage('Error', message, 'error');
    });
}

function deleteServiceButtonClicked(id) {

    var params = {};
    params.id = id;
    globals.ajaxService.deleteService(params, function successCallback(selfClaims) {
        globals.showToastMessage('Success', 'Service Deleted', 'success');
        showServices();
    }, function errorCallback(message) {
        globals.showToastMessage('Error', message, 'error');
    });
}

function proformaTable(data) {
    var sNo = 1;
    $('#allProformasTable tbody').empty();
    for (var i = 0; i < data.length; i++) {
        var totalPaymentReceived = 0;
        var totalProformaAmount = 0;
        var totalAppliedAmount = 0;
        var row = '<tr>';
        row += '<td>' + sNo + '</td>';
        row += '<td>' + data[i].user.name + '</td>';
        row += '<td>' + data[i].patientName + '</td>';
        row += '<td>' + data[i].user.mobile + '</td>';
        row += '<td>' + formatDate(data[i].createdAt) + '</td>';

        for (var j = 0; j < data[i].paymentInfos.length; j++) {
            totalPaymentReceived = totalPaymentReceived + data[i].paymentInfos[j].amount;
        }
        for (var k = 0; k < data[i].proformaItems.length; k++) {
            totalProformaAmount = totalProformaAmount + data[i].proformaItems[k].updatedPrice;
        }
        totalAppliedAmount = data[i].discountAmount + data[i].writeOffAmount + totalPaymentReceived;
        if (data[i].paymentInfos.length < 1) {
            row += '<td><a class="invoice-error" title="Invoice" '
                    + 'onclick="errorInvoiceAlert()"><i class="file alternate icon edit-button"'
                    + ' title="Edit"></i>Create Invoice</a></td>';
        }
        if (data[i].paymentInfos.length > 0) {
            if (totalProformaAmount === totalAppliedAmount) {
                row += '<td><a class="invoice-success" title="Create Invoice"'
                        + 'href="admin/invoice/' + btoa(data[i].id) 
                        + '"><i class="file alternate icon edit-button"></i>Create Invoice</a></td>';
            }
            if (totalProformaAmount != totalAppliedAmount) {
                row += '<td><a class="invoice-error" title="Invoice"'
                        + ' onclick="errorInvoiceAlert()"><i class="file alternate icon edit-button"'
                        + ' title="Edit"></i>Create Invoice</a></td>';
            }
        }
        
        row += '<td><a target="_blank" href="admin/proforma-edit/' + btoa(data[i].id) 
                + '"><i class="edit icon edit-button" title="Edit"></i></a></td>';
        row += '<td><i onclick="deleteProformaButtonClicked(' 
                + data[i].id 
                + ')" class="trash alternate outline icon delete-button" title="Delete"></i></td>';
        row += '<tr>';
        sNo++;

        $('#allProformasTable tbody').append(row);
    }
}

function errorInvoiceAlert() {
    globals.showToastMessage('Error', 'Please complete the proforma payment first', 'error');
}

function updateServicesTable(servicesData) {
    $('#adminServices tbody').empty();
    var sNo = 1;
    for (var i = 0; i <= servicesData.length - 1; i++) {
        var row = '<tr>';
        row += '<td>' + sNo + '</td>';
        row += '<td>' + servicesData[i].serviceName + '</td>';
        row += '<td>' + servicesData[i].serviceType + '</td>';
        row += '<td>' + servicesData[i].price + '</td>';
        // row += '<td>Edit</td>';
        row += '<td><i onclick="deleteServiceButtonClicked(' +servicesData[i].id+ ')" class="trash alternate outline icon delete-button" title="Delete"></i></td>';
        row += '</tr>';
        $('#adminServices tbody').append(row);
        sNo++;
    }
}

$(document).ready(function() {
    $('#proformaSearchClearAllButton').css('display', 'none');
    // Display all admin services
    showServices();
    getAllProformas();

    // sidebar
    $('.ui.sidebar').sidebar({
        context: $('.bottom.segment')
    }).sidebar('attach events', '.sidebar.menu .item');

    $('#hamburgerMenuIcon').on('click', function() {
        $('.ui.sidebar').sidebar('toggle');
    });

    $('.ui.sidebar .item').tab();

    $('.ui.checkbox').checkbox();

    getSelfClaims(function(selfClaims) {
        // populate table
        $('#selfClaimsTable tbody').empty();
        selfClaims.forEach(function(selfClaim) {
            var row = '<tr>';
            row += '<td>' + selfClaim.scid + '</td>';
            row += '<td>' + selfClaim.progressLevel + '</td>';
            row += '<td>' + selfClaim.userSsid + '</td>';
            row += '<td>' + selfClaim.user.mobile + '</td>';
            row += '<td>' + selfClaim.user.name + '</td>';
            row += '<td>' + selfClaim.user.gender + '</td>';
            row += '<td>' + selfClaim.user.email + '</td>';
            row += '<td>' 
                    + new Date(selfClaim.user.createdAt).toLocaleDateString() 
                    + '</td>';
            row += '<td><a href="admin/selfClaim/form/' 
                    + selfClaim.scid 
                    + '" target="_blank">PDF Form</a></td>';
            row += '<td><a href="admin/selfClaim/download-data/' 
                    + selfClaim.scid 
                    + '" target="_blank">Download</a></td>';
            row += '</tr>';
            $('#selfClaimsTable tbody').append(row);
        });
    });

    getUsers(function(users) {
        // populate table
        $('#usersTable tbody').empty();
        users.forEach(function(user) {
            var row = '<tr>';
            row += '<td>' + user.ssid + '</td>';
            row += '<td>' + user.mobile + '</td>';
            row += '<td>' + user.name + '</td>';
            row += '<td>' + user.gender + '</td>';
            row += '<td>' + user.email + '</td>';
            row += '<td>' 
                    + new Date(user.createdAt).toLocaleDateString() 
                    + '</td>';
            row += '</tr>';
            $('#usersTable tbody').append(row);
        });
    });

    $('#serviceUpdateButton').css('display','none');

    // Add Services
    $('#serviceAddButton').on('click', function(e) {

        var serviceName = $('#adminServices input[data-field="serviceName"]').val();
        var serviceType = $('#adminServices input[data-field="serviceType"]').val();
        var servicePrice = $('#adminServices input[data-field="servicePrice"]').val();
        var hasError = false;

        if (serviceName == '') {
            hasError = true;
            $('#serviceNameError').css('display','block');
            $('#serviceNameError').text('Please enter service name');
            setTimeout(function() {
                $('#serviceNameError').fadeOut('slow');
            }, 3000);
        } else if (serviceType == '') {
            hasError = true;
            $('#serviceTypeError').css('display','block');
            $('#serviceTypeError').text('Please enter service type');
            setTimeout(function() {
                $('#serviceTypeError').fadeOut('slow');
            }, 3000);
        } else if (servicePrice == '') {
            $('#servicePriceError').css('display','block');
            $('#servicePriceError').text('Please enter service price');
            setTimeout(function() {
                $('#servicePriceError').fadeOut('slow');
            }, 3000);
        }
        if (!hasError) {
            addNewService();
        }
    });

    getAdminProfile(function(admin) {
        // populate my profile
        $('#myProfile input[name="mobile"]').val(admin.mobile);
        $('#myProfile input[name="name"]').val(admin.name);
        $('#myProfile input[name="email"]').val(admin.email);
        $('#myProfile input[name="organisation"]').val(admin.organisation);

        $('#myProfile input[name="gender"]').removeAttr('checked');
        $('#myProfile input[name="gender"][value="' + admin.gender + '"]')
                .attr('checked', 'checked').click();
    });

});

$('#proformaDateWiseSearch').on('click', function() {
    var proformaDateFrom = $('#searchBar input[data-field="proformaDateFrom"]').val();
    var proformaDateTo = $('#searchBar input[data-field="proformaDateTo"]').val();
    var hasError = false;

    if (proformaDateFrom == '') {
        hasError = true;
        $('#proformaDateFromError').css('display', 'block');
        $('#proformaDateFromError').text('Please select date');
        setTimeout(function() {
            $('#proformaDateFromError').fadeOut('slow');
        }, 4000);
    } else if (proformaDateTo == '') {
        hasError = true;
        $('#proformaDateToError').css('display', 'block');
        $('#proformaDateToError').text('Please select date');
        setTimeout(function() {
            $('#proformaDateToError').fadeOut('slow');
        }, 4000);
    } else if (proformaDateFrom > proformaDateTo) {
        hasError = true;
        $('#proformaDateToError').css('display', 'block');
        $('#proformaDateToError').text('Please select valid date');
        setTimeout(function() {
            $('#proformaDateToError').fadeOut('slow');
        }, 4000);
    }
    if (!hasError) {
        var params = {};
        params.dateFrom = proformaDateFrom;
        params.dateTo = proformaDateTo;
        globals.ajaxService.searchProformaDateWise(params, function successCallback(result) {
            proformaTable(result);
            $('#searchMessage').css('display', 'block');
            $('#searchMessage span[data-field="totalNumbers"]').text(result.length);
            $('#searchMessage span[data-field="message"]').text(' Proformas found');
            $('#proformaSearchClearAllButton').css('display', 'inline-block');
            $('html, body').animate({
                scrollTop: $(".proforma-result").offset().top
            }, 500);
        }, function failureCallback(message) {
            globals.showToastMessage('Error', message, 'error');
        });
    }
});

$('#proformaDateWiseSearchClear').on('click', function() {
    $('#searchBar input[data-field="proformaDateFrom"]').val('');
    $('#searchBar input[data-field="proformaDateTo"]').val('');
    $('#searchMessage').css('display', 'none');
    $('#proformaSearchClearAllButton').css('display', 'none');
    getAllProformas();
});

$('#proformaSearchClearAll').on('click', function() {
    $('#searchMessage').css('display', 'none');
    $('#proformaSearchClearAllButton').css('display', 'none');
    getAllProformas();
});

$('#searchByMobileButton').on('click', function() {
    var mobileNumber = $('#searchBar input[data-field="searchByMobile"]').val();
    console.log(mobileNumber);
    var hasError = false;

    if (mobileNumber == '') {
        hasError = true;
        $('#searchByMobileError').css('display', 'block');
        $('#searchByMobileError').text('Please enter mobile number');
        setTimeout(function() {
            $('#searchByMobileError').fadeOut('slow');
        }, 4000);
    } else if (!mobileNumber.match(/^\d{10}$/)) {
        hasError = true;
        $('#searchByMobileError').css('display', 'block');
        $('#searchByMobileError').text('Please enter valid mobile number');
        setTimeout(function() {
            $('#searchByMobileError').fadeOut('slow');
        }, 4000);
    }
    if (!hasError) {
        var params = {};
        params.mobileNumber = mobileNumber;
        globals.ajaxService.searchProformaByMobile(params, function successCallback(result) {
            proformaTable(result);
            $('#searchMessage').css('display', 'block');
            $('#searchMessage span[data-field="totalNumbers"]').text(result.length);
            $('#searchMessage span[data-field="message"]').text(' Proformas found');
            $('#proformaSearchClearAllButton').css('display', 'inline-block');
            $('html, body').animate({
                scrollTop: $(".proforma-result").offset().top
            }, 500);
        }, function failureCallback(message) {
            globals.showToastMessage('Error', message, 'error');
        });
    }
});

$('#searchByPatientButton').on('click', function() {
    var patientName  = $('#searchBar input[data-field="searchByPatient"]').val();
    var hasError = false;

    if (patientName == '') {
        hasError = true;
        $('#searchByPatientError').css('display', 'block');
        $('#searchByPatientError').text('Please enter patient name');
        setTimeout(function() {
            $('#searchByPatientError').fadeOut('slow');
        }, 4000);
    }
    if (!hasError) {
        var params = {};
        params.patientName = patientName;
        globals.ajaxService.searchProformaByPatient(params, function successCallback(result) {
            proformaTable(result);
            $('#searchMessage').css('display', 'block');
            $('#searchMessage span[data-field="totalNumbers"]').text(result.length);
            $('#searchMessage span[data-field="message"]').text(' Proformas found');
            $('#proformaSearchClearAllButton').css('display', 'inline-block');
            $('html, body').animate({
                scrollTop: $(".proforma-result").offset().top
            }, 500);
        }, function failureCallback(message) {
            globals.showToastMessage('Error', message, 'error');
        });
    }
});

$('#proformaPeriodButton').on('click', function() {
    var proformaPeriod = $('#proformaPeriod').val();
    var hasError = false;
    console.log(proformaPeriod);

    if (proformaPeriod == null) {
        hasError = true;
        $('#proformaPeriodError').css('display', 'block');
        $('#proformaPeriodError').text('Please select proforma period');
        setTimeout(function() {
            $('#proformaPeriodError').fadeOut('slow');
        }, 3000);
    }
    if (!hasError) {
    }
});

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
        return [day, month, year].join('/');
    } else {
        return '';
    }
}