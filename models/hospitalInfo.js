'use strict';

module.exports = function(sequelize, DataTypes) {
	var HospitalInfo = sequelize.define('hospitalInfo', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
	    name: {
	    	type: DataTypes.STRING,
	    	allowNull: true
	    },
	    dateOfAdmission: {
	    	type: DataTypes.DATE,
	    	allowNull: true
	    },
	    dateOfDischarge: {
	    	type: DataTypes.DATE,
	    	allowNull: true
	    },
	    selfClaimScid: {
	    	type: DataTypes.INTEGER,
	    	references: {
	    		model: 'selfClaims',
	    		key: 'scid'
	    	}
	    },
	    city: {
	    	type: DataTypes.STRING,
	    	allowNull: true
	    },
	    state: {
	    	type: DataTypes.STRING,
	    	allowNull: true
	    }
	});

	HospitalInfo.associate = function(models) {
		HospitalInfo.belongsTo(models.selfClaim);
	}  

	return HospitalInfo;
};