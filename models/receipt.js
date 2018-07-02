'use strict';

module.exports = function(sequelize, DataTypes) {
	var Receipt = sequelize.define('receipt', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
	    date: {
	    	type: DataTypes.DATE,
	    	allowNull: true
	    },
	    number: {
	    	type: DataTypes.STRING,
	    	allowNull: true
	    },
	    amount: {
	    	type: DataTypes.INTEGER,
	    	allowNull: true
	    },
	    type: {
	    	type: DataTypes.STRING,
	    	allowNull: true
	    },
	    selfClaimScid: {
	    	type: DataTypes.INTEGER,
	    	references: {
	    		model: 'selfClaims',
	    		key: 'scid'
	    	}
	    },
	    isActive: {
	    	type: DataTypes.BOOLEAN,
	    	allowNull: false,
	    	defaultValue: true
	    }
	}, {
		timestamp: true
	});

	Receipt.associate = function(models) {
		Receipt.belongsTo(models.selfClaim);
	}  

	return Receipt;
};