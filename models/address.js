'use strict';

module.exports = function(sequelize, DataTypes) {
	var Address = sequelize.define('address', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
	    line1: {
	    	type: DataTypes.STRING,
	    	allowNull: true
	    },
	    line2: {
	    	type: DataTypes.STRING,
	    	allowNull: true
	    },
	    city: {
	    	type: DataTypes.STRING,
	    	allowNull: true
	    },
	    state: {
	    	type: DataTypes.STRING,
	    	allowNull: true
	    },
	    pin: {
	    	type: DataTypes.INTEGER,
	    	allowNull: true
	    },
	    country: {
	    	type: DataTypes.STRING,
	    	allowNull: false,
	    	defaultValue: 'India'
	    }      
	});  
	return Address;
};