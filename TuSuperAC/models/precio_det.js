const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('precio_det', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    precioCab: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'precio_cab',
        key: 'id'
      }
    },
    codigo: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    precio: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'precio_det',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "precioCab",
        using: "BTREE",
        fields: [
          { name: "precioCab" },
        ]
      },
    ]
  });
};
