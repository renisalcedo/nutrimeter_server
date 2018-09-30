require('dotenv').config()
const mongoose = require('mongoose')
const vision = require('@google-cloud/vision')
const client = new vision.ImageAnnotatorClient()
const { resolve } = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const axios = require('axios')

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
  // const file = req.file.path
  const file = './src/tmp/uploads/apple.png'

  // Handle request and returns text on image
  client
    .webDetection(file)
    .then(results => {
      // ENSURE NAME WILL ONLY BE FOOD NAME IN DATABASE
      const name = filterFood(results[0].webDetection.bestGuessLabels[0].label)

      if (name === -1) {
        return res.status(400).send(-1)
      }
      console.log(name)

      // MAKES THE CALL FOR GETTING THE NUTRITION
      axios
        .post('https://15e7bd6c.ngrok.io/nutrition/get', { name })
        .then(foodData => res.status(200).send(foodData.data))
        .catch(err => res.status(400).json(undefined))
    })
    .catch(err => res.status(400).send(err))
})

// FILTER FOOD BASED ON DATABASE FOOD
function filterFood(food) {
  food = food.split(' ')

  axios
    .get('https://15e7bd6c.ngrok.io/nutrition/getall')
    .then(all => {
      for (let i = 0; i < food.length; i++) {
        if (all.data.includes(food[i])) {
          return food[i]
        }
      }
      return -1
    })
    .catch(err => err)
}

module.exports = app
