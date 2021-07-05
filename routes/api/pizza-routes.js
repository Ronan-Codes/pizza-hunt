const router = require('express').Router();
const {
    getAllPizza,
    getPizzaById,
    createPizza,
    updatePizza,
    deletePizza
} = require('../../controllers/pizza-controller');
// Instead of importing the entire object and doing pizzaController.getAllPizza(), destructured method names instead

// Set up GET all and POST at /api/pizzas
router
    .route('/')
    .get(getAllPizza)
    .post(createPizza);

// Set up GET one, PUT, DELETE at /api/pizzas/:id
router
    .route('/:id')
    .get(getPizzaById)
    .put(updatePizza)
    .delete(deletePizza);

module.exports = router;

// Variations
/*
    // this code
    router.route('/').get(getCallbackFunction).post(postCallbackFunction);

    // is this same as this
    router.get('/', getCallbackFunction);
    router.post('/' postCallbackFunction);
*/

// This is just an alternative to previous projects' approach. Benefit is easier to read.
    // But more files (import/export), can make tracking more difficult
