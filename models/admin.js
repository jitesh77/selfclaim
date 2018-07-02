'use strict';

module.exports = function(sequelize, DataTypes) {
	var Admin = sequelize.define('admin', {
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
	    	allowNull: false
	    },
	    password: {
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
	    	allowNull: false,
	    	validate: {
	    		isEmail: true
	    	}
	    },
	    type: {
	    	type: DataTypes.STRING,
	    	allowNull: false
	    },
	    organisation: {
	    	type: DataTypes.STRING,
	    	allowNull: true
	    },
	    deactivated: {
	    	type: DataTypes.BOOLEAN,
	    	allowNull: true,
	    	defaultValue: false
	    },
	    dob: {
	    	type: DataTypes.DATE,
	    	allowNull: true
	    }
	}, {
		timestamp: true
	});  
	return Admin;
};