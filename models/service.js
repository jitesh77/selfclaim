'use strict';

module.exports = function(sequelize, DataTypes) {
	var Service = sequelize.define('service', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		serviceName: {
			type: DataTypes.STRING,
			allowNull: true
		},
	    serviceType: {
	    	type: DataTypes.STRING,
	    	allowNull: true
	    },
	    price: {
	    	type: DataTypes.INTEGER,
	    	allowNull: true
	    }
	}, {
		timestamp: true
	});

	Service.associate = function(models) {
		Service.hasOne(models.serviceRegistration);
		Service.hasMany(models.proformaItem);
	}

	return Service;
};