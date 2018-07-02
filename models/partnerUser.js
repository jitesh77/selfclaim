'use strict';

module.exports = function(sequelize, DataTypes) {
	var PartnerUser = sequelize.define('partnerUser', {
		id: { 
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
	    	defaultValue: 'FDE'
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

	PartnerUser.associate = function(models) {
		PartnerUser.belongsTo(models.partnerAccount);
	}  
	
	return PartnerUser;
};