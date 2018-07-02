'use strict';

module.exports = function(sequelize, DataTypes) {
	var User = sequelize.define('user', {
		ssid: { // ssid stands for sureserve id, legacy reason
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
	    mobile: {
	    	type: DataTypes.STRING,
	    	unique: true,
	    	allowNull: false
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
	    deactivated: {
	    	type: DataTypes.BOOLEAN,
	    	allowNull: false,
	    	defaultValue: false
	    },
	    type: {
	    	type: DataTypes.STRING,
	    	allowNull: false,
	    	defaultValue: 'optimus' // optimus or sureserve (admin) or any third party
	    },
	    sourceId: {
	    	type: DataTypes.INTEGER,
	    	references: {
	    		model: 'sources',
	    		key: 'id'
	    	}
	    },
	    partnerAccountId: {
	    	type: DataTypes.INTEGER,
	    	references: {
	    		model: 'partnerAccounts',
	    		key: 'id'
	    	}
	    }
	}, {
		timestamp: true
	});

	User.associate = function(models) {
		User.hasMany(models.selfClaim);
		User.belongsTo(models.source);
		User.belongsTo(models.partnerAccount);
		User.hasMany(models.invoice);
		User.hasMany(models.proforma);
	}  
	
	return User;
};