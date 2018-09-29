require('dotenv').config()
const mongoose = require('mongoose')
const fs = require('fs')
const vision = require('@google-cloud/vision')
const client = new vision.ImageAnnotatorClient()
const { resolve, parse } = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')

// Sets temporary storage point
const upload = multer({
  dest: resolve(__dirname, './tmp/uploads')
}).single('recognize')

// App Routes Setup
const app = express()

const nutriRoutes = require('./routes/nutrition.routes')
app.use(nutriRoutes)

// Set up Mongoose
const DB = process.env.DB
mongoose.connect(
  DB,
  { useNewUrlParser: true }
)

mongoose.Promise = global.Promise

// Use body parser
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }))
app.use(bodyParser.json({ limit: '50mb' }))

// End point for users to send image
app.post('/recognize', upload, (req, res, next) => {
  const file = req.file.path

  // Handle request and returns text on image
  client
    .documentTextDetection(file, { languageHints: 'en' })
    .then(results => {
      const labels = results[0].fullTextAnnotation.text

      console.log(labels)
      res.status(200).send(labels)
    })
    .catch(err => {
      res.status(400).send(err)
    })
})

module.exports = app
