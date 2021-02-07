// Model for image_product

const { Model, DataTypes } = require('sequelize')

class ImagesProducts extends Model {
  static init (sequelize) {
    super.init({
      id: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      name: DataTypes.STRING,
      size: DataTypes.FLOAT,
      key: DataTypes.STRING,
      url: DataTypes.STRING
    },
    {
      sequelize
    })
  }
}

module.exports = ImagesProducts
