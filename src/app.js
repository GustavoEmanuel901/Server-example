const express = require('express')
const { errors } = require('celebrate')
const morgan = require('morgan')
const path = require('path')
const cors = require('cors')
const routes = require('./routes')

const app = express()

app.use(cors({
  exposedHeaders: '*'
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')))
app.use(routes)
app.use(errors())

module.exports = app
