'use strict';

module.exports = function(sequelize, DataTypes) {
	var PolicyHolder = sequelize.define('policyHolder', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
	    mobile: {
	    	type: DataTypes.STRING,
	    	unique: true,
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
	    	unique: true,
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

    PolicyHolder.associate = function(models) {
    	PolicyHolder.belongsTo(models.address);
    	PolicyHolder.belongsTo(models.selfClaim);
    }

	return PolicyHolder;
};