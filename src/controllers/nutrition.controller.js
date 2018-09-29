const Nutrition = require('../models/nutrition')

class Nutritions {
  getByName(req, res) {
    Nutrition.findOne({ name: req.body.name })
      .then(nutrition => res.status(200).json(nutrition))
      .catch(error => res.status(400).json({ error }))
  }

  async createNutrition(req, res) {
    if (Object.keys(req.body).length <= 0) {
      return res
        .status(400)
        .json({ errors: 'There is no data in this request' })
    }

    // CREATE NEW NUTRITION COLLECTION
    const { name, calories, fat, carbs, protein, sugar, sodium } = req.body
    const newItem = await new Nutrition({
      name,
      calories,
      fat,
      carbs,
      protein,
      sugar,
      sodium
    })
    newItem
      .save()
      .then(newItem => res.status(200).json(newItem))
      .catch(error => res.status(400).json({ error }))
  }

  deleteItem(req, res) {
    Nutrition.findOneAndRemove({ _id: req.params.id })
      .then(item => res.status(200).json(item))
      .catch(error => res.status(400).json({ error }))
  }
}

module.exports = new Nutritions()
