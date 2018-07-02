const insurers = require('./insurer.json');
const tpas = require('./tpa.json');
const states = require('./state.json');
const admins = require('./admin.json');
const bcrypt = require('bcrypt');

function createInsurer(index, models) {
	if (index < insurers.length) {
		const insurer = insurers[index];
		index += 1;
		models.insurer.findOne({
			where: {
				companyIdentificationNo: insurer.companyIdentificationNo
			}
		}).then(function(data) {
			if (!data) {
				models.insurer.create(insurer).then(function() {
					console.log('insurer created: ', insurer);
					createInsurer(index, models);
				}).catch(function(err) {
					console.log(err);
				});
			} else {
				console.log('Already Present: ', insurer.companyIdentificationNo);
				createInsurer(index, models);
			}
		}).catch(function(err) {
			console.log(err);
		});
	}
}

function createTPA(index, models) {
	if (index < tpas.length) {
		const tpa = tpas[index];
		index += 1;
		models.tpa.findOne({
			where: {
				irdaRegistrationNo: tpa.irdaRegistrationNo
			}
		}).then(function(data) {
			if (!data) {
				models.tpa.create(tpa).then(function() {
					console.log('TPA created: ', tpa);
					createTPA(index, models);
				}).catch(function(err) {
					console.log(err);
				});
			} else {
				console.log('Already Present: ', tpa.irdaRegistrationNo);
				createTPA(index, models);
			}
		}).catch(function(err) {
			console.log(err);
		});
	}
}

function createState(index, models) {
	if (index < states.length) {
		const state = states[index];
		index += 1;
		models.state.findOne({
			where: {
				sno: state.sno
			}
		}).then(function(data) {
			if (!data) {
				models.state.create(state).then(function() {
					console.log('State created: ', state);
					createState(index, models);
				}).catch(function(err) {
					console.log(err);
				});
			} else {
				console.log('Already Present: ', state.name);
				createState(index, models);
			}
		}).catch(function(err) {
			console.log(err);
		});
	}
}

function createAdmin(index, models) {
	if (index < admins.length) {
		const admin = admins[index];
		index += 1;
		models.admin.findOne({
			where: {
				mobile: admin.mobile
			}
		}).then(function(data) {
			if (!data) {
				
				// generate hash
                bcrypt.hash(admin.password, 10, function(err, hash) {
                    if (err) { 
                        console.log(err); 
                    } else {
                        admin.password = hash;

                        // insert admin into db
                        models.admin.create(admin).then(function() {
                        	console.log('Admin created: ', admin);
                        	createAdmin(index, models);
                        }).catch(function(err) {
                        	console.log(err);
                        });
                    }
                });
				
			} else {
				console.log('Already Present: ', admin.mobile);
				createAdmin(index, models);
			}
		}).catch(function(err) {
			console.log(err);
		});
	}
}


module.exports = function(models) {
	
	// inserting insurers
	createInsurer(0, models);
	
	// inserting tpas
	createTPA(0, models);

	// inserting states
	createState(0, models);

	// inserting Admins
	createAdmin(0, models);	

}