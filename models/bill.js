'use strict';

module.exports = function(sequelize, DataTypes) {
	var Bill = sequelize.define('bill', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
	    date: {
	    	type: DataTypes.DATE,
	    	allowNull: true
	    },
	    number: {
	    	type: DataTypes.STRING,
	    	allowNull: true
	    },
	    amount: {
	    	type: DataTypes.INTEGER,
	    	allowNull: true
	    },
	    issuedBy: {
	    	type: DataTypes.STRING,
	    	allowNull: true
	    },
	    type: {
	    	type: DataTypes.STRING,
	    	allowNull: true
	    },
	    claimCategory: {
	    	type: DataTypes.STRING,
	    	allowNull: false,
	    	defaultValue: 'pre' // pre, post or hc
	    },
	    isOtherServices: {
	    	type: DataTypes.BOOLEAN,
	    	allowNull: false,
	    	defaultValue: false
	    },
	    isConsultation: {
	    	type: DataTypes.BOOLEAN,
	    	allowNull: false,
	    	defaultValue: false
	    },
	    isLabOrDiagnostics: {
	    	type: DataTypes.BOOLEAN,
	    	allowNull: false,
	    	defaultValue: false
	    },
	    isBloodBank: {
	    	type: DataTypes.BOOLEAN,
	    	allowNull: false,
	    	defaultValue: false
	    },
	    selfClaimScid: {
	    	type: DataTypes.INTEGER,
	    	references: {
	    		model: 'selfClaims',
	    		key: 'scid'
	    	}
	    },
	    isActive: {
	    	type: DataTypes.BOOLEAN,
	    	allowNull: false,
	    	defaultValue: true
	    }
	}, {
		timestamp: true
	}); 

	Bill.associate = function(models) {
		Bill.belongsTo(models.selfClaim);
	} 

	return Bill;
};