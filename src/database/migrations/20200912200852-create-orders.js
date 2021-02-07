/*
  file that define the columns and their attributes of the
  orders table in the database,
  if you want to change or add any fields to the orders
  table in the database this is the file.
*/

'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('orders', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      client_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      client_email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isEmail: true
        }
      },
      client_whatsapp: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        validate: {
          isNumeric: true
        }
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      delivery_city: {
        type: Sequelize.STRING,
        allowNull: false
      },
      zipcode: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      delivery_address: {
        type: Sequelize.STRING,
        allowNull: false
      },
      observations: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      dispatched: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      send_date: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      },
      product_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: { model: 'products', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('orders')
  }
}
