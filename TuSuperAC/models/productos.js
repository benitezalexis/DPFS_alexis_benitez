const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('productos', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    codCategoria: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'categorias',
        key: 'id'
      }
    },
    codSubCategoria: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'subcategorias',
        key: 'id'
      }
    },
    codigo: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    tipo: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    stock_actual: {
      type: DataTypes.DOUBLE(10,3),
      allowNull: true
    },
    stock_minimo: {
      type: DataTypes.DOUBLE(10,3),
      allowNull: true
    },
    visible: {
      type: DataTypes.STRING(1),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'productos',
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
        name: "codCategoria",
        using: "BTREE",
        fields: [
          { name: "codCategoria" },
        ]
      },
      {
        name: "codSubCategoria",
        using: "BTREE",
        fields: [
          { name: "codSubCategoria" },
        ]
      },
    ]
  });
};
