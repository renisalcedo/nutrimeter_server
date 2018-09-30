const { Router } = require('express')
const bodyParser = require('body-parser')
const {
  getAll,
  getByName,
  createNutrition,
  deleteItem
} = require('../controllers/nutrition.controller')

// BODYPARSER FOR SPECIFIC ROUTES
// ================================================================================================
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })

// ROUTES
const router = new Router()

router.get('/nutrition/getall', getAll)

/**
 * Path: '/nutrition/get'
 * GET all items
 * @param req
 * @param res
 * @returns Get specific item by its name
 */
router.post('/nutrition/get', jsonParser, getByName)

/**
 * Path: '/nutrition/new'
 * POST a new nutrition
 * @param req
 * @param res
 * @returns Creates new nutrition
 */
router.post('/nutrition/new', jsonParser, createNutrition)

/**
 * Path: '/item/:id'
 * DELETE an item
 * @param req
 * @param res
 * @returns deleted item
 */
router.delete('/item/:id', deleteItem)

module.exports = router
