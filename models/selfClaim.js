'use strict';

module.exports = function(sequelize, DataTypes) {
	var SelfClaim = sequelize.define('selfClaim', {
		scid: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
	    patientRelationshipWithPolicyHolder: {
	    	type: DataTypes.STRING,
	    	allowNull: true,
	    	defaultValue: 'self'
	    },
	    isPatientAlsoPolicyHolder: {
	    	type: DataTypes.BOOLEAN,
	    	allowNull: false,
	    	defaultValue: false
	    },
	    userSsid: {
	    	type: DataTypes.INTEGER,
	    	references: {
	    		model: 'users',
	    		key: 'ssid'
	    	}
	    },
	    progressLevel: {
	    	type: DataTypes.INTEGER,
	    	allowNull: false,
	    	defaultValue: 1
	    },
	    country: {
	    	type: DataTypes.STRING,
	    	allowNull: false,
	    	defaultValue: 'India'
	    },
	    claimName: {
	    	type: DataTypes.STRING,
	    	allowNull: true
	    }
	    
	}, {
		timestamp: true
	}); 

	SelfClaim.associate = function(models) {
		SelfClaim.belongsTo(models.user);
		SelfClaim.hasOne(models.patient);
		SelfClaim.hasOne(models.policyHolder);
		SelfClaim.hasOne(models.hospitalInfo);
		SelfClaim.hasOne(models.insuranceInfo);
		SelfClaim.hasMany(models.bill);
		SelfClaim.hasMany(models.receipt);
		SelfClaim.hasOne(models.communicationInfo);
		SelfClaim.hasOne(models.treatmentInfo);
	} 

	return SelfClaim;
};