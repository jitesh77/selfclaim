/**
 * @author Manoj Kumar<manojswami600@gmail.com>
 */


$(document).ready(function(){
  $('.defaultActive').addClass("active");

    // Number of claims
    getUserClaims(function(selfClaims) {
        $('#dashboardClaims td[data-field="totalClaims"]').text(selfClaims[0].count);       
    });

    // Display user claims
    getUserClaimData(function(selfClaimData) {

        $('#menu span[data-field="userNameHeading"]').text((selfClaimData[0]).user.name);

        totalClaims = selfClaimData.length;
        $('#userClaimsDataTable tbody').empty();

        var sNo = 1;
        for (var i = 0; i <= selfClaimData.length - 1; i++) {

            var dobOfPatient = new Date(selfClaimData[i].patient.dob);       
            var dobOfPatientFormat = dobOfPatient.getDate() + '/' 
                + (dobOfPatient.getMonth() + 1) + '/' 
                + dobOfPatient.getFullYear();
            var admissionDate = new Date(selfClaimData[i].hospitalInfo.dateOfAdmission);
            var admissionDateFormat = admissionDate.getDate() + '/' 
                + (admissionDate.getMonth() + 1) + '/' 
                + admissionDate.getFullYear();

            if (selfClaimData[i].claimName == null) {
                selfClaimData[i].claimName = ''
            }
            if (selfClaimData[i].policyHolder.name == null) {
                selfClaimData[i].policyHolder.name = ''
            }
            if (selfClaimData[i].patient.name == null) {
                selfClaimData[i].policyHolder.name = ''
            }
            if (selfClaimData[i].policyHolder.name == null) {
                selfClaimData[i].policyHolder.name = ''
            }
            if (selfClaimData[i].patient.name == null) {
                selfClaimData[i].patient.name = ''
            }
            if (selfClaimData[i].hospitalInfo.name == null) {
                selfClaimData[i].hospitalInfo.name = ''
            }
            if (selfClaimData[i].insuranceInfo.insurer == null) {
                selfClaimData[i].insuranceInfo.insurer = {
                    name: ''
                };
            }

            var row = '<tr>';
            row += '<td>' + sNo + '</td>';
            row += '<td>' + selfClaimData[i].claimName + '</td>';
            row += '<td>' + selfClaimData[i].policyHolder.name + '</td>';
            row += '<td>' + selfClaimData[i].patient.name + '</td>';
            row += '<td>' + dobOfPatientFormat + '</td>';
            row += '<td>' + admissionDateFormat + '</td>';
            row += '<td>' + selfClaimData[i].hospitalInfo.name + '</td>';
            row += '<td>' + selfClaimData[i].insuranceInfo.insurer.name + '</td>';
            row += '<td>' + '<a href="dashboard/myclaim/' + btoa(selfClaimData[i].scid) +'"><button class="ui active button view-claim">View</button></a>' + '</td>';
            row += '</tr>';

            $('#userClaimsDataTable tbody').append(row);
            sNo++;
        }
    });

    // User Services
    getUserServices(function(selfClaims) {
    });

    // User Profile
    getUserProfile(function(userProfile) {
        $('#updateUserProfile input[data-field="userName"]').val(userProfile.name);
        $('#updateUserProfile input[data-field="userNumber"]').val(userProfile.mobile);
        $('#updateUserProfile input[data-field="userEmail"]').val(userProfile.email);
        
    });
});

// View Claim
$('#viewSelfClaim').on('click', function(e) {
    viewSelfClaim();
});

var viewSelfClaim = function() {
    var params = {};
    globals.ajaxService.viewSelfClaim(params, function successCallback(selfClaims) {
        window.location.href = 'dashboard/';
    }, function errorCallback(message) {
        globals.showToastMessage('Error', message, 'error');
    });
}

// Dashboard Tab
function getUserClaims(callback) {
    var params = {};
    globals.ajaxService.getUserClaims(params, function successCallback(selfClaims) {
        callback(selfClaims);
    }, function errorCallback(message) {
        globals.showToastMessage('Error', message, 'error');
    });
}

// Selfclaim Tab
function getUserClaimData(callback) {
    var params = {};
    globals.ajaxService.getUserClaimData(params, function successCallback(selfClaims) {
        callback(selfClaims);
    }, function errorCallback(message) {
        globals.showToastMessage('Error', message, 'error');
    });
}

// Services display
function getUserServices(callback) {
    var params = {};
    globals.ajaxService.getUserServices(params, function successCallback(services) {
        showUserServices(services);
    }, function errorCallback(message) {
        globals.showToastMessage('Error', message, 'error');
    });
}

// Show user services
function showUserServices(userServices) {

    $('#userServicesTable tbody').empty();
    var sNo = 1;

    for (var i = 0; i < userServices.length; i++) {
        var row = '<tr>';
        row += '<td>' + sNo + '</td>';
        row += '<td>' + userServices[i].service.serviceName + '</td>';
        row += '<td>' + new Date(userServices[i].createdAt).toDateString() + '</td>';
        row += '<td> Pending </td>';
        row += '</tr>';
        sNo++;
        $('#userServicesTable tbody').append(row);
    }
}

// Profile display
function getUserProfile(callback) {
    var params = {};
    globals.ajaxService.getUserProfile(params, function successCallback(selfClaims) {
        callback(selfClaims);
    }, function errorCallback(message) {
        globals.showToastMessage('Error', message, 'error');
    });
}

// Profile Update
$('#updateProfileButton').on('click', function(e) {
    saveUserProfile();
});

var saveUserProfile = function() {
    var params = {};
    params.name = $('#updateUserProfile input[data-field="userName"]').val();
    params.email = $('#updateUserProfile input[data-field="userEmail"]').val();

    globals.ajaxService.saveUserProfile(params, function successCallback(selfClaims) {
        globals.showToastMessage('Success', 'Profile Updated', 'success');
        $('#menu span[data-field="userNameHeading"]').text(params.name);
    }, function errorCallback(message) {
        globals.showToastMessage('Error', message, 'error');
    });
}

// Tabs
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    document.getElementById("mySidenav").style.width = "0";
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tab-links");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Side bar list in mobile view
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

// Default open Dashboard
document.getElementById("defaultOpen").click();


