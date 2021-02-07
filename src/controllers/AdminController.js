/* File with the features related to the admin */

const { uuid } = require('uuidv4')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

const Admin = require('../models/Admin')
const generateToken = require('../utils/genereteToken')
const envEmail = require('../services/email')

module.exports = {

  /*
    Method for creating admin, this method is not adding the routes,
    but you are ready to create an admin
  */
  async store (req, res) {
    const { email, password } = req.body

    try {
      const adminAlreadyExists = await Admin.findOne({
        where: { email }
      })

      if (adminAlreadyExists) {
        return res.status(401).send({ message: 'Admin already exists' })
      }

      const id = uuid()

      const password_hash = await bcrypt.hash(password, 8)

      await Admin.create({
        id,
        email,
        password_hash
      })

      return res.status(201).send({ message: 'Admin created with success' })
    } catch (error) {
      return res.status(400).send({ error: 'Registration failed, try again' })
    }
  },

  // Method for admin login in the application
  async session (req, res) {
    const { email, password } = req.body

    try {
      const admin = await Admin.findOne({
        where: { email }
      })

      if (!admin) {
        return res.status(400).send({ error: 'Admin not Found' })
      }

      if (!await bcrypt.compare(password, admin.password_hash)) {
        return res.status(400).send({ error: 'Invalid passwod' })
      }

      return res.json({ admin_id: admin.id, token: generateToken({ id: admin.id }) })
    } catch (error) {
      return res.status(400).send({ error: 'Login failed, try again' })
    }
  },

  // method in case an admin forgets the password
  async forgotPassword (req, res) {
    const { email } = req.body

    try {
      const admin = await Admin.findOne({
        where: { email }
      })

      if (!admin) {
        return res.status(400).send({ error: 'Admin not found' })
      }

      const token = crypto.randomBytes(20).toString('hex')

      const now = new Date()

      now.setHours(now.getHours() + 1)

      await Admin.update({
        password_reset_token: token,
        password_reset_expires: now
      }, { where: { email } })

      await envEmail.sendMail({
        to: email,
        from: process.env.EMAIL_USER,
        subject: 'Password Recovery',
        template: 'forgot_password',
        context: { token }
      }, err => {
        if (err) {
          return res.status(400).json({ error: 'Cannot send forgot password email' })
        }
      })

      return res.status(200).send({ message: 'Token successfully sent' })
    } catch (error) {
      return res.status(400).send({ error: 'Error on forgot password, try again' })
    }
  },

  // method to change admin password
  async resetPassword (req, res) {
    const { email, token, password } = req.body

    try {
      const admin = await Admin.findOne({
        where: { email }
      })

      if (!admin) {
        return res.status(400).json({ error: 'Admin not found' })
      }

      if (token !== admin.password_reset_token) {
        return res.status(400).json({ error: 'Token Invalid' })
      }

      const now = new Date()

      if (now > admin.password_reset_expires) {
        return res.status(400).json({ error: 'Token expired, generate a new one' })
      }

      const password_hash = await bcrypt.hash(password, 8)

      await Admin.update({
        password_reset_token: null,
        password_reset_expires: null,
        password_hash
      }, { where: { email } })

      return res.status(200).send({ message: 'Password changed successfully' })
    } catch (error) {
      return res.status(400).json({ error: 'Cannot reset password, try again' })
    }
  }
}
