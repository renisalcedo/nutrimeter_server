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

// // FILTER FOOD BASED ON DATABASE FOOD
const filterFood = function(food) {
  return new Promise((resolve, reject) => {
    food = food.split(' ')

    axios.get('https://15e7bd6c.ngrok.io/nutrition/getall').then(all => {
      for (let i = 0; i < food.length; i++) {
        if (all.data.includes(food[i])) {
          return resolve(food[i])
        }
      }

      return reject(-1)
    })
  })
}

// End point for users to send image
app.post('/recognize', upload, (req, res, next) => {
  const file = req.file.path

  // Handle request and returns text on image
  client
    .webDetection(file)
    .then(results => {
      // ENSURE NAME WILL ONLY BE FOOD NAME IN DATABASE
      const food = results[0].webDetection.bestGuessLabels[0].label

      filterFood(food).then(foodName => {
        // MAKES THE CALL FOR GETTING THE NUTRITION
        axios
          .post('https://15e7bd6c.ngrok.io/nutrition/get', {
            name: foodName
          })
          .then(foodData => res.status(200).send(foodData.data))
          .catch(err => res.status(400).json(undefined))
          .catch(err => res.status(400).send(err))
      })
    })
    .catch(err => err)
})

module.exports = app
