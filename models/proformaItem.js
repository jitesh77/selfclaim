'use strict';

module.exports = function(sequelize, DataTypes) {
	var ProformaItem = sequelize.define('proformaItem', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		proformaId: {
	    	type: DataTypes.INTEGER,
	    	allowNull: false,
	    	references: {
	    		model: 'proformas',
	    		key: 'id'
	    	}
	    },
	    serviceId: {
	    	type: DataTypes.INTEGER,
	    	allowNull: false,
	    	references: {
	    		model: 'services',
	    		key: 'id'
	    	}
	    },
	    quantity: {
	    	type: DataTypes.INTEGER,
	    	allowNull: false
	    },
	    updatedPrice: {
	    	type: DataTypes.INTEGER,
	    	allowNull: false
	    	
	    },
	    adminId: {
	    	type: DataTypes.INTEGER,
	    	allowNull: false,
	    	references: {
	    		model: 'admins',
	    		key: 'id'
	    	}
	    }
	}, {
		timestamp: true
	});  
	ProformaItem.associate = function(models) {
		ProformaItem.belongsTo(models.service);
		ProformaItem.belongsTo(models.admin);
		ProformaItem.belongsTo(models.proforma);
	}
	return ProformaItem;
};