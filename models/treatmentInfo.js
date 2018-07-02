'use strict';

module.exports = function(sequelize, DataTypes) {
	var TreatmentInfo = sequelize.define('treatmentInfo', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
	    reasonForHospitalization: {
	    	type: DataTypes.STRING,
	    	allowNull: true
	    },
	    treatmentName: {
	    	type: DataTypes.STRING,
	    	allowNull: true
	    },
	    diseaseFirstDetectedDate: {
	    	type: DataTypes.DATE,
	    	allowNull: true
	    },
	    dateOfDelivery: {
	    	type: DataTypes.DATE,
	    	allowNull: true
	    },
	    typeOfDelivery: {
	    	type: DataTypes.STRING,
	    	allowNull: true
	    },
	    dateOfInjury: {
	    	type: DataTypes.DATE,
	    	allowNull: true
	    },
	    causeOfInjury: {
	    	type: DataTypes.STRING,
	    	allowNull: true
	    },
	    isCaseMedicoLegal: {
	    	type: DataTypes.BOOLEAN,
	    	allowNull: true,
	    	defaultValue: false
	    },
	    wasCaseReportedToPolice: {
	    	type: DataTypes.BOOLEAN,
	    	allowNull: true,
	    	defaultValue: false
	    },
	    roomCategory: {
	    	type: DataTypes.STRING,
	    	allowNull: true
	    },
	    selfClaimScid: {
	    	type: DataTypes.INTEGER,
	    	references: {
	    		model: 'selfClaims',
	    		key: 'scid'
	    	}
	    }
	});  

    TreatmentInfo.associate = function(models) {
    	TreatmentInfo.belongsTo(models.selfClaim);
    }

	return TreatmentInfo;
};