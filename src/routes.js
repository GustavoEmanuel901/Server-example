/* file destined for your API routes */

require('dotenv').config()

const routes = require('express').Router()
const { celebrate, Segments, Joi } = require('celebrate')
const multer = require('multer')
const multerConfig = require('./config/multer')
const auth = require('./middlewares/auth')

const AdminController = require('./controllers/AdminController')
const ImageProductsController = require('./controllers/ImageProductsController')
const ProductController = require('./controllers/ProductController')
const OrderController = require('./controllers/OrderController')

require('./database')

// Image management routes
routes.post('/images',
  auth,
  multer(multerConfig).single('file'),
  ImageProductsController.store
)

routes.delete('/images/:id/:key',
  auth,
  ImageProductsController.delete
)

// Routes for Products
routes.post('/products/:image_id',
  auth,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required(),
      description: Joi.string().required().max(100),
      value: Joi.number().required()
    })
  }),
  ProductController.store)

routes.get('/products', ProductController.index)

routes.delete('/products/:id',
  auth,
  ProductController.delete
)

// Routes for Orders
routes.post('/orders',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      client_name: Joi.string().required(),
      client_email: Joi.string().required().email(),
      client_whatsapp: Joi.number().required(),
      quantity: Joi.number().required(),
      delivery_city: Joi.string().required(),
      zipcode: Joi.number().required(),
      delivery_address: Joi.string().required(),
      observations: Joi.string().max(100),
      product_id: Joi.string().required()
    })
  }),
  OrderController.store
)

routes.get('/orders/unsent',
  auth,
  OrderController.unsentList
)

routes.get('/orders/sent',
  auth,
  OrderController.sentList
)

routes.put('/orders/dispatch/:id',
  auth,
  OrderController.updateDelivery
)

routes.delete('/orders/:id',
  auth,
  OrderController.delete
)

// Routes for Admin
routes.post('/session', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required()
  })
}), AdminController.session)

routes.put('/forgotPassword', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email()
  })
}), AdminController.forgotPassword)

routes.put('/resetPassword', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    token: Joi.string().required(),
    password: Joi.string().required().min(6)
  })
}), AdminController.resetPassword)

module.exports = routes
