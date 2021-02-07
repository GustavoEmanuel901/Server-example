/* File to generate the authentication token for the admin login */

const jwt = require('jsonwebtoken')

function generateToken (params = {}) {
  return jwt.sign(params, process.env.APP_SECRET, {
    expiresIn: 86400 // token lifetime in seconds
  })
}

module.exports = generateToken
