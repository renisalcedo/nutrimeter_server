const mongoose = require('mongoose')

const NutritionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  calories: {
    type: Number,
    required: true
  },
  fat: {
    type: Number,
    required: true
  },
  choles: {
    type: Number
  },
  sodium: {
    type: Number,
    required: true
  },
  potass: {
    type: Number,
    required: true
  },
  carbs: {
    type: Number,
    required: true
  },
  protein: {
    type: Number,
    required: true
  },
  sugar: {
    type: Number
  }
})

module.exports = mongoose.model('nutrition', NutritionSchema)
