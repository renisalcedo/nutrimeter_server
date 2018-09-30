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
    const { name, calories, fat, choles, sodium, potass, carbs, protein, sugar } = req.body

    const item = await Nutrition.findOne({ name })
    if (item != null) {
       return res.status(400).json("Already Exist")
     }

    const newItem = await new Nutrition({
      name,
      calories,
      fat,
      choles,
      sodium,
      potass,
      carbs,
      protein,
      sugar
    })
    newItem
      .save()
      .then(newItem => res.status(200).json(newItem))
      .catch(error => res.status(400).json({ error }))
  }

  getAll(req, res) {
    let names = []
    let data = Nutrition.find({}, function(err, docs){
      if(!err){
        for(let i = 0; i < docs.length; i++){
          names.push(docs[i].name)
        }
        return res.send(names)
      }
    })
  }

  deleteItem(req, res) {
    Nutrition.findOneAndRemove({ _id: req.params.id })
      .then(item => res.status(200).json(item))
      .catch(error => res.status(400).json({ error }))
  }
}

module.exports = new Nutritions()
