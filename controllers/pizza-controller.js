const { Pizza } = require('../models');

const pizzaController = {
    // the functions will go in here as methods

    // Get all pizzas. Like findAll(). Callback function for the GET /api/pizzas route
    getAllPizza(req, res) {
        Pizza.find({})
            .populate({
                path: 'comments',
                // include everything but __v (notice minus sign)
                select: '-__v'
            })
            // same function as select above
            .select('-__v')
            .sort({ _id: -1 })
            .then(dbPizzaData => res.json(dbPizzaData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // Get one pizza by id. Like findOne().
    // Destructured params out of req, since it's only data we need to fulfill request
    getPizzaById({ params }, res) {
        Pizza.findOne({ _id: params.id })
            .populate({
                path: 'comments',
                select: '-__v'
            })
            .select('-__v')
            .then(dbPizzaData => {
                // if no pizza is found, send 404
                if (!dbPizzaData) {
                    res.status(404).json({ message: `No pizza found with this id!` });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // createPizza
        // destructured body out of Express.js req (other data not needed)
    createPizza({ body }, res) {
        Pizza.create(body)
            .then(dbPizzaData => res.json(dbPizzaData))
            .catch(err => res.status(400).json(err));
    },

    // update pizza by id
    updatePizza({ params, body }, res) {
        // New: true returns new version. False will return old version.
        Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true })
            .then(dbPizzaData => {
                if(!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.status(400).json(err));
    },

    // delete pizza
    deletePizza({ params }, res) {
        Pizza.findOneAndDelete({ _id: params.id })
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' });
                    return;
                }
                // or true
                res.json(dbPizzaData);
            })
            .catch(err => res.status(400).json(err));
    }
}

module.exports = pizzaController;

// After making CRUD methods, create the routes and hook these methods up to them!

// Two ways of writing object methods
/*
    const dogObject = {
    // this...
    bark: function() {
        console.log('Woof!');
    },

    // ... is the same as this
    bark() {
        console.log('Woof!');
    }
    }
*/