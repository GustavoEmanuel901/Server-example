// Model for Orders

const { Model, DataTypes } = require('sequelize')

class Order extends Model {
  static init (sequelize) {
    super.init({
      id: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      client_name: DataTypes.STRING,
      client_email: DataTypes.STRING,
      client_whatsapp: DataTypes.DOUBLE,
      quantity: DataTypes.INTEGER,
      delivery_city: DataTypes.STRING,
      zipcode: DataTypes.DOUBLE,
      delivery_address: DataTypes.STRING,
      observations: DataTypes.TEXT,
      dispatched: DataTypes.BOOLEAN,
      send_date: DataTypes.DATE
    },
    {
      sequelize
    })
  }

  static associate (models) {
    this.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'product'
    })
  }
}

module.exports = Order
