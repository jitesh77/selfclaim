'use strict';

module.exports = function(sequelize, DataTypes) {
	var ClaimCalculatorBills = sequelize.define('claimCalculatorBills', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		billDate: {
	    	type: DataTypes.DATE,
	    	allowNull: false
	    },
	    billNumber: {
	    	type: DataTypes.INTEGER,
	    	allowNull: false
	    },
	    billAmount: {
	    	type: DataTypes.INTEGER,
	    	allowNull: false
	    },
	    billType: {
	    	type: DataTypes.STRING,
	    	allowNull: false
	    },
	    claimCalculatorId: {
	    	type: DataTypes.INTEGER,
	    	allowNull: false,
	    	references: {
	    		model: 'claimCalculators',
	    		key: 'id'
	    	}
	    }
	});  
	ClaimCalculatorBills.associate = function(models) {
		ClaimCalculatorBills.belongsTo(models.claimCalculator);
	}
	return ClaimCalculatorBills;
};