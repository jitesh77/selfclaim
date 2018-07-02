'use strict';

module.exports = function(sequelize, DataTypes) {
	var Proforma = sequelize.define('proforma', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		proformaComment: {
	    	type: DataTypes.STRING,
	    	allowNull: true
	    },
		proformaDate: {
	    	type: DataTypes.DATE,
	    	allowNull: true
	    },
	    proformaAmount: {
	    	type: DataTypes.INTEGER,
	    	allowNull: true
	    },
	    discountAmount: {
	    	type: DataTypes.INTEGER,
	    	allowNull: true,
	    	defaultValue: '0'
	    },
	    writeOffAmount: {
	    	type: DataTypes.INTEGER,
	    	allowNull: true,
	    	defaultValue: '0'
	    },
	    proformaFinalAmount: {
	    	type: DataTypes.INTEGER,
	    	allowNull: true
	    },
	    patientName: {
	    	type: DataTypes.STRING,
	    	allowNull: true
	    },
	    writeoffBy: {
	    	type: DataTypes.DATE,
	    	allowNull: true
	    },
	    userSsid: {
	    	type: DataTypes.INTEGER,
	    	allowNull: false,
	    	references: {
	    		model: 'users',
	    		key: 'ssid'
	    	}
	    }
	}, {
		timestamp: true
	});  
	Proforma.associate = function(models) {
		Proforma.belongsTo(models.user);
		Proforma.hasMany(models.proformaItem);
		Proforma.hasMany(models.paymentInfo);
	}
	return Proforma;
};