'use strict';

module.exports = function(sequelize, DataTypes) {
	var paymentInfo = sequelize.define('paymentInfo', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		amount: {
	    	type: DataTypes.INTEGER,
	    	allowNull: false
	    },
	    paymentMode: {
	    	type: DataTypes.STRING,
	    	allowNull: false
	    },
	    receivedBy: {
	    	type: DataTypes.STRING,
	    	allowNull: false
	    },
	    receivedDate: {
	    	type: DataTypes.DATE,
	    	allowNull: false
	    },
	    proformaId: {
	    	type: DataTypes.INTEGER,
	    	allowNull: false,
	    	references: {
	    		model: 'proformas',
	    		key: 'id'
	    	}
	    }
	}, {
		timestamp: true
	});  
	paymentInfo.associate = function(models) {
		paymentInfo.belongsTo(models.proforma);
	}
	return paymentInfo;
};