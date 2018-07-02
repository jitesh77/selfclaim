'use strict';

module.exports = function(sequelize, DataTypes) {
	var Source = sequelize.define('source', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
	    sourceType: {
	    	type: DataTypes.STRING,
	    	allowNull: true
	    },
	    subSource: {
	    	type: DataTypes.STRING,
	    	allowNull: true
	    }
	});

	Source.associate = function(models) {
		Source.hasMany(models.user);
	}  

	return Source;
};