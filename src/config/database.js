/*
  File with settings related to the database
  if you need or want to change any configuration of your relational database this is the file
*/

require('dotenv').config({
  path: '.env'
})

module.exports = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  dialect: process.env.DB_DIALECT,
  logging: false,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true
  }
}
