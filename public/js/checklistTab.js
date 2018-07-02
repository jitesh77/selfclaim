/**
 * @author Varun Kumar<varunon9@gmail.com>
 * https://github.com/varunon9
 */

'use strict';

$(document).ready(function() {
	$('.info-checklist-segment span i').on('click', function(e) {
		var tabNoToVisit = $(e.target).attr('data-goToTab');
		setActiveTab(parseInt(tabNoToVisit));
	});

	$('#syncChecklistIcon').on('click', function() {
		// getting latest self claim info
		globals.ajaxService.getLatestSelfClaim({}, function successCallback(result) {
			var selfClaim = result;

			updateChecklistTab(selfClaim);
			globals.showToastMessage('Success', 'Synced from server', 'success');

		}, function failureCallback(message) {
			globals.showToastMessage('Error', message, 'error');
		});
	});
});