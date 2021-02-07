/*
  file that define the columns and their attributes of the
  products table in the database,
  if you want to change or add any fields to the products
  table in the database this is the file.
*/

'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('products', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      value: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      image_id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        references: { model: 'images_products', key: 'id' },
        onDelete: 'CASCADE',
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
    await queryInterface.dropTable('products')
  }
}
