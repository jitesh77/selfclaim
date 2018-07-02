'use strict';

module.exports = function(sequelize, DataTypes) {
	var PartnerAccount = sequelize.define('partnerAccount', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
	    businessName: {
	    	type: DataTypes.STRING,
	    	allowNull: true
	    },
	    businessType: {
	    	type: DataTypes.STRING,
	    	allowNull: true
	    },
	    category: {
	    	type: DataTypes.STRING,
	    	allowNull: true
	    },
	    websiteLink: {
	    	type: DataTypes.STRING,
	    	allowNull: true
	    },
	    email: {
	    	type: DataTypes.STRING,
	    	allowNull: true
	    },
	    location: {
	    	type: DataTypes.STRING,
	    	allowNull: true
	    },
	    logoUrl: {
	    	type: DataTypes.STRING,
	    	allowNull: true
	    },
	    deactivated: {
	    	type: DataTypes.BOOLEAN,
	    	allowNull: true,
	    	defaultValue: false
	    }
	}, {
		timestamp: true
	});  

	PartnerAccount.associate = function(models) {
		PartnerAccount.hasMany(models.partnerUser);
	} 

	return PartnerAccount;
};