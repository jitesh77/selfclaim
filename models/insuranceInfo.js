'use strict';

module.exports = function(sequelize, DataTypes) {
	var InsuranceInfo = sequelize.define('insuranceInfo', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
	    policyType: {
	    	type: DataTypes.STRING,
	    	allowNull: true
	    },
	    policyNumber: {
	    	type: DataTypes.STRING,
	    	allowNull: true
	    },
	    tpaCustomerId: {
	    	type: DataTypes.STRING,
	    	allowNull: true
	    },
	    insurerCustomerId: {
	    	type: DataTypes.STRING,
	    	allowNull: true
	    },
	    corporateName: {
	    	type: DataTypes.STRING,
	    	allowNull: true
	    },
	    employeeId: {
	    	type: DataTypes.STRING,
	    	allowNull: true
	    },
	    certificateNumber: {
	    	type: DataTypes.STRING,
	    	allowNull: true
	    },
	    selfClaimScid: {
	    	type: DataTypes.INTEGER,
	    	references: {
	    		model: 'selfClaims',
	    		key: 'scid'
	    	}
	    },
	    insurerId: {
	    	type: DataTypes.INTEGER,
	    	references: {
	    		model: 'insurers',
	    		key: 'id'
	    	}
	    },
	    tpaId: {
	    	type: DataTypes.INTEGER,
	    	references: {
	    		model: 'tpas',
	    		key: 'id'
	    	}
	    },
	}); 

	InsuranceInfo.associate = function(models) {
        InsuranceInfo.belongsTo(models.selfClaim);
        InsuranceInfo.belongsTo(models.insurer);
        InsuranceInfo.belongsTo(models.tpa);
	} 

	return InsuranceInfo;
};