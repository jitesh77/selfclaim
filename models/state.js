'use strict';

module.exports = function(sequelize, DataTypes) {
	var State = sequelize.define('state', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
	    name: {
	    	type: DataTypes.STRING,
	    	allowNull: false
	    },
	    sno: {
	    	type: DataTypes.INTEGER,
	    	allowNull: false
	    }
	});  
	return State;
};