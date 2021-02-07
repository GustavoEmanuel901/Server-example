// Archive with order functionalities

const { uuid } = require('uuidv4')
const { Op } = require('sequelize')

const envEmail = require('../services/email')
const Order = require('../models/Order')

module.exports = {

  // Method to list orders already sent
  async sentList (req, res) {
    const { page, search } = req.query

    try {
      const orders = await Order.findAndCountAll({
        where: {
          dispatched: true,
          [Op.or]: {
            client_name: {
              [Op.like]: `%${search}%`
            },
            delivery_city: {
              [Op.like]: `%${search}%`
            },
            delivery_address: {
              [Op.like]: `%${search}%`
            }
          }
        },
        include: 'product',
        limit: 6,
        offset: (page - 1) * 6
      })

      res.header('X-Total-Count', orders.count)

      return res.json(orders.rows)
    } catch (error) {
      console.log(error)
      return res.status(400).send({ error: 'Failed to find records, try again' })
    }
  },

  // Method for listing orders not yet shipped
  async unsentList (req, res) {
    const { page, search } = req.query

    try {
      const orders = await Order.findAndCountAll({
        where: {
          dispatched: false,
          [Op.or]: {
            client_name: {
              [Op.like]: `%${search}%`
            },
            delivery_city: {
              [Op.like]: `%${search}%`
            },
            delivery_address: {
              [Op.like]: `%${search}%`
            }
          }
        },
        include: 'product',
        limit: 6,
        offset: (page - 1) * 6
      })

      res.header('X-Total-Count', orders.count)

      return res.json(orders.rows)
    } catch (error) {
      console.log(error)
      return res.status(400).send({ error: 'Failed to find records, try again' })
    }
  },

  // Method for registering orders
  async store (req, res) {
    const {
      client_name,
      client_email,
      client_whatsapp,
      quantity,
      delivery_city,
      zipcode,
      delivery_address,
      observations,
      product_id
    } = req.body

    try {
      const id = uuid()

      await Order.create({
        id,
        client_name,
        client_email,
        client_whatsapp,
        quantity,
        delivery_city,
        zipcode,
        delivery_address,
        observations,
        product_id
      })

      await envEmail.sendMail({
        to: client_email,
        from: process.env.EMAIL_USER,
        subject: 'Your order was placed',
        template: 'order_placed'
      }, err => {
        if (err) {
          return res.status(400).json({ error: 'Error sending the order confirmation email' })
        }
      })

      return res.status(201).send({ message: 'Admin created with success' })
    } catch (error) {
      return res.status(400).send({ error: 'Registration failed, try again' })
    }
  },

  // Method to update the order status (sent or not)
  async updateDelivery (req, res) {
    const { id } = req.params

    try {
      const order = await Order.findByPk(id)

      if (!order) {
        return res.status(400).send({ error: 'Order not Found' })
      }

      const now = new Date()

      await order.update({
        send_date: now,
        dispatched: true
      })

      return res.status(200).send({ message: 'Order updated with success' })
    } catch (error) {
      return res.status(400).send({ error: 'error updating order, try again' })
    }
  },

  // Method to delete order
  async delete (req, res) {
    const { id } = req.params

    try {
      const order = await Order.findOne({
        where: {
          id,
          dispatched: true
        }
      })

      if (!order) {
        return res.status(400).send({ error: 'Order not Found' })
      }

      await order.destroy()

      return res.status(200).send({ message: 'Order successfully deleted' })
    } catch (error) {
      return res.status(400).send({ error: 'error deleting order, try again' })
    }
  }
}
