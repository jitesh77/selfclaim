'use strict';

module.exports = function(sequelize, DataTypes) {
	var Patient = sequelize.define('patient', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
	    mobile: {
	    	type: DataTypes.STRING,
	    	allowNull: true
	    },
	    name: {
	    	type: DataTypes.STRING,
	    	allowNull: true
	    },
	    gender: {
	    	type: DataTypes.STRING,
	    	allowNull: false,
	    	defaultValue: 'male'
	    },
	    email: {
	    	type: DataTypes.STRING,
	    	allowNull: true
	    },
	    dob: {
	    	type: DataTypes.DATE,
	    	allowNull: true
	    },
	    occupation: {
	    	type: DataTypes.STRING,
	    	allowNull: true
	    },
	    deactivated: {
	    	type: DataTypes.BOOLEAN,
	    	allowNull: true,
	    	defaultValue: false
	    },
	    selfClaimScid: {
	    	type: DataTypes.INTEGER,
	    	references: {
	    		model: 'selfClaims',
	    		key: 'scid'
	    	}
	    },
	    addressId: {
	    	type: DataTypes.INTEGER,
	    	references: {
	    		model: 'addresses',
	    		key: 'id'
	    	}
	    }
	}, {
		timestamp: true
	}); 

	Patient.associate = function(models) {
		Patient.belongsTo(models.address);
		Patient.belongsTo(models.selfClaim);
	} 

	return Patient;
};