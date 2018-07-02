'use strict';

module.exports = function(sequelize, DataTypes) {
	var Invoice = sequelize.define('invoice', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		invoiceNumber: {
	    	type: DataTypes.INTEGER,
	    	unique: true,
	    	allowNull: false
	    },
	    invoiceAmount: {
	    	type: DataTypes.INTEGER,
	    	allowNull: false
	    },
	    userSsid: {
	    	type: DataTypes.INTEGER,
	    	allowNull: false,
	    	references: {
	    		model: 'users',
	    		key: 'ssid'
	    	}
	    },
	    generatedBy: {
	    	type: DataTypes.STRING,
	    	allowNull: false
	    }
	}, {
		timestamp: true
	});  
	Invoice.associate = function(models) {
		Invoice.belongsTo(models.user);
	}
	return Invoice;
};