'use strict';

module.exports = function(sequelize, DataTypes) {
	var CommunicationInfo = sequelize.define('communicationInfo', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
	    email: {
	    	type: DataTypes.STRING,
	    	allowNull: true
	    },
	    mobile: {
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
	    addressId: {
	    	type: DataTypes.INTEGER,
	    	references: {
	    		model: 'addresses',
	    		key: 'id'
	    	}
	    }
	});  

	CommunicationInfo.associate = function(models) {
		CommunicationInfo.belongsTo(models.selfClaim);
		CommunicationInfo.belongsTo(models.address);
	}

	return CommunicationInfo;
};