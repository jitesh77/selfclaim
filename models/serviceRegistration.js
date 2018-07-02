'use strict';

module.exports = function(sequelize, DataTypes) {
	var ServiceRegistration = sequelize.define('serviceRegistration', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		userSsid: {
			type: DataTypes.INTEGER,
			references: {
				model: 'users',
				key: 'ssid'
			}
		},
		serviceId: {
			type: DataTypes.INTEGER,
			references: {
				model: 'services',
				key: 'id'
			}
		}
	}, {
		timestamp: true
	});
  
	ServiceRegistration.associate = function(models) {
		ServiceRegistration.belongsTo(models.service);
	}

	return ServiceRegistration;
};