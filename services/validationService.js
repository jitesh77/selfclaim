const models = require('../models');

module.exports = {

	doesSuchUserExist: function(param) {
		return new Promise((resolve, reject) => {
			let condition = {
				mobile: param
			};
			if (param.length != 10) {
				condition = {
					ssid: param
				}
			};
			models.user.findOne({
				where: condition
			}).then((user) => {
			    if (user) {
			    	resolve(true);
			    } else {
			    	resolve(false);
			    }
			}).catch((err) => {
			    reject(err);
			});
		});
	},

	doesSuchAdminExist: function(param) {
		return new Promise((resolve, reject) => {
			let condition = {
				mobile: param
			};
			if (param.length != 10) {
				condition = {
					id: param
				}
			};
			models.admin.findOne({
				where: condition
			}).then((admin) => {
			    if (admin) {
			    	resolve(true);
			    } else {
			    	resolve(false);
			    }
			}).catch((err) => {
			    reject(err);
			});
		});
	},

	doesSuchPatientExist: function(mobile) {
		return new Promise((resolve, reject) => {
			models.patient.findOne({
				where: {
					mobile: mobile
				}
			}).then((patient) => {
			    if (patient) {
			    	resolve(true);
			    } else {
			    	resolve(false);
			    }
			}).catch((err) => {
			    reject(err);
			});
		});
	},

	doesSuchSelfClaimExist: function(scid) {
		return new Promise((resolve, reject) => {
			models.selfClaim.findOne({
				where: {
					scid: scid
				}
			}).then((selfClaim) => {
			    if (selfClaim) {
			    	resolve(true);
			    } else {
			    	resolve(false);
			    }
			}).catch((err) => {
			    reject(err);
			});
		});
	},

	doesSelfClaimBelongsToUser: function(params) {
		return new Promise((resolve, reject) => {
			models.selfClaim.findOne({
				where: {
					scid: params.scid,
					userSsid: params.ssid
				}
			}).then((selfClaim) => {
			    if (selfClaim) {
			    	resolve(true);
			    } else {
			    	resolve(false);
			    }
			}).catch((err) => {
			    reject(err);
			});
		});
	}

};