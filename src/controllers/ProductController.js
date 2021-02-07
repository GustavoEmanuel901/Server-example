//  Archive with products functionalities

const { uuid } = require('uuidv4')
const { Op } = require('sequelize')
const Product = require('../models/Product')

module.exports = {

  // Method for listing products
  async index (req, res) {
    const { page, search } = req.query
    try {
      const products = await Product.findAndCountAll({
        where: {
          name: {
            [Op.like]: `%${search}%`
          }
        },
        include: 'image',
        limit: 6,
        offset: (page - 1) * 6
      })

      res.header('X-Total-Count', products.count)

      return res.json(products.rows)
    } catch (error) {
      return res.status(400).send({ error: 'Failed to find records, try again' })
    }
  },

  // Method to register products
  async store (req, res) {
    const { name, description, value } = req.body
    const { image_id } = req.params

    try {
      const id = uuid()

      await Product.create({
        id,
        name,
        description,
        value,
        image_id
      })

      return res.status(201).send({ message: 'Product created with success' })
    } catch (error) {
      return res.status(400).send({ error: 'Registration failed, try again' })
    }
  },

  // Method for deleting products
  async delete (req, res) {
    const { id } = req.params

    try {
      const product = await Product.findByPk(id)

      if (!product) {
        return res.status(400).send({ error: 'Product not found' })
      }

      await product.destroy()

      return res.status(200).send({ message: 'Product successfully deleted' })
    } catch (error) {
      return res.status(400).send({ error: 'Error deleting product, try again' })
    }
  }
}
