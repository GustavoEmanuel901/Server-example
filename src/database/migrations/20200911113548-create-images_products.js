/*
  file that define the columns and their attributes of the
  images_products table in the database,
  if you want to change or add any fields to the images_products
  table in the database this is the file.
*/

'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('images_products', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      size: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      key: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isUrl: true
        }
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
    await queryInterface.dropTable('images_products')
  }
}
