const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const startups = sequelize.define(
    'startups',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      name: {
        type: DataTypes.TEXT,
      },

      sector: {
        type: DataTypes.TEXT,
      },

      description: {
        type: DataTypes.TEXT,
      },

      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  startups.associate = (db) => {
    db.startups.belongsToMany(db.investments, {
      as: 'investments',
      foreignKey: {
        name: 'startups_investmentsId',
      },
      constraints: false,
      through: 'startupsInvestmentsInvestments',
    });

    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    db.startups.hasMany(db.investments, {
      as: 'investments_startup',
      foreignKey: {
        name: 'startupId',
      },
      constraints: false,
    });

    //end loop

    db.startups.belongsTo(db.organizations, {
      as: 'organization',
      foreignKey: {
        name: 'organizationId',
      },
      constraints: false,
    });

    db.startups.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.startups.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return startups;
};
