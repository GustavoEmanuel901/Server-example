// Model for Products

const { Model, DataTypes } = require('sequelize')

class Product extends Model {
  static init (sequelize) {
    super.init({
      id: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      value: DataTypes.FLOAT
    },
    {
      sequelize
    })
  }

  static associate (models) {
    this.belongsTo(models.ImagesProducts, {
      foreignKey: 'image_id',
      as: 'image'
    })
  }
}

module.exports = Product
