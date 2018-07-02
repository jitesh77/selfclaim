'use strict';

module.exports = function(sequelize, DataTypes) {
	var ClaimCalculator = sequelize.define('claimCalculator', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		dateOfAdmission: {
	    	type: DataTypes.DATE,
	    	allowNull: false
	    },
	    dateOfDischarge: {
	    	type: DataTypes.DATE,
	    	allowNull: false
	    },
		ipAddress: {
	    	type: DataTypes.STRING,
	    	allowNull: false
	    }
	}, {
		timestamp: true
	});  
	ClaimCalculator.associate = function(models) {
		ClaimCalculator.hasMany(models.claimCalculatorBills);
	}
	return ClaimCalculator;
};