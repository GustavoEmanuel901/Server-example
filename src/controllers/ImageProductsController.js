// Image functionality file

const { uuid } = require('uuidv4')
const ImagesProducts = require('../models/ImagesProducts')
const aws = require('aws-sdk')
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

module.exports = {
  // Method for add image product in database
  async store (req, res) {
    let { originalname: name, size, key, location: url = '' } = req.file

    if (!url) {
      url = `${process.env.APP_URL}/files/${key}`
    }

    try {
      const id = uuid()

      const image = await ImagesProducts.create({
        id,
        name,
        size,
        key,
        url
      })

      return res.json(image)
    } catch (error) {
      return res.status(400).send({ error: 'Image registration error, try again' })
    }
  },

  // Method for delete image product from database and cloud
  async delete (req, res) {
    const { id, key } = req.params

    const s3 = new aws.S3()

    try {
      const image = await ImagesProducts.findOne({
        where: {
          id,
          key
        }
      })

      if (!image) {
        return res.status(400).send({ error: 'Image not Found' })
      }

      if (process.env.STORAGE_TYPE === 's3') {
        s3.deleteObject({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key
        }).promise()
      } else {
        promisify(fs.unlink)(
          path.resolve(__dirname, '..', '..', 'tmp', 'uploads', key)
        )
      }

      await image.destroy()

      return res.status(200).send({ message: 'Image successfully deleted' })
    } catch (error) {
      return res.status(400).send({ error: 'Error when deleting image, try again' })
    }
  }
}
