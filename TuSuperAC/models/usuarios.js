const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('usuarios', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    celular: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    ruc_ci: {
      type: DataTypes.STRING(17),
      allowNull: true,
      unique: "ruc_ci"
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    direccion: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    tipo: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    logo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      allowNull: true
    },
    fecha_modificacion: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'usuarios',
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
        name: "ruc_ci",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ruc_ci" },
        ]
      },
    ]
  });
};
