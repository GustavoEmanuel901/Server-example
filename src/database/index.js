// File to manage database connections

const Sequelize = require('sequelize')
const dbConfig = require('../config/database')

const Admin = require('../models/Admin')
const ImagesProducts = require('../models/ImagesProducts')
const Order = require('../models/Order')
const Product = require('../models/Product')

const connection = new Sequelize(dbConfig)

Admin.init(connection)
ImagesProducts.init(connection)
Product.init(connection)
Order.init(connection)

Product.associate(connection.models)
Order.associate(connection.models)

module.exports = connection
