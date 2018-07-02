/**
 * @author Manoj Kumar<manojswami600@gmail.com>
 */

$(document).ready(function() {
	$('#downloadClaimButton').on('click', function() {
		var hasError = false;
		var claimKey = $('#claimKey').val();
		var privateKey = $('#privateKey').val();
		if (claimKey == '') {
			hasError = true;
			$('#claimKeyError').css('display','block');
			$('#claimKeyError').text('Please enter your claim key');
			setTimeout(function() {
				$('#claimKeyError').fadeOut('slow');
			}, 4000);
		} else if (!/^[A-Za-z0-9]{8}$/g.test(claimKey)) {
			hasError = true;
			$('#claimKeyError').css('display','block');
			$('#claimKeyError').text('Claim key must be 8 digit');
			setTimeout(function() {
				$('#claimKeyError').fadeOut('slow');
			}, 4000);
		} else if (privateKey == '') {
			hasError = true;
			$('#privateKeyError').css('display','block');
			$('#privateKeyError').text('Please enter your private key');
			setTimeout(function() {
				$('#privateKeyError').fadeOut('slow');
			}, 4000);
		}
	});

	getSelfClaimDataKey(function(selfClaims) {
        // populate table
        $('#keyTable tbody').empty();
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
            row += '</tr>';
            $('#selfClaimsTable tbody').append(row);
        });
    });
});

function getSelfClaimDataKey(callback) {
    var params = {};
    globals.ajaxService.getSelfClaimDataKey(params, function successCallback(selfClaims) {
        callback(selfClaims);
    }, function errorCallback(message) {
        globals.showToastMessage('Error', message, 'error');
    });
}
