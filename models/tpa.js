'use strict';

module.exports = function(sequelize, DataTypes) {
	var TPA = sequelize.define('tpa', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
	    name: {
	    	type: DataTypes.STRING,
	    	allowNull: false
	    },
	    irdaRegistrationNo: {
	    	type: DataTypes.STRING,
	    	allowNull: true
	    },
	    companyIdentificationNo: {
	    	type: DataTypes.STRING,
	    	allowNull: true
	    },
	    address: {
	    	type: DataTypes.STRING,
	    	allowNull: true
	    },
	    type: {
	    	type: DataTypes.STRING,
	    	allowNull: true
	    },
	    activeStatus: {
	    	type: DataTypes.STRING,
	    	allowNull: false,
	    	defaultValue: 'active'
	    }
	});  
	return TPA;
};