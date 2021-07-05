const { schema, model, Schema } = require('mongoose')
// We could import the entire mongoose library, but we only need to worry about the Schema constructor and model function

const PizzaSchema = new Schema({
    pizzaName: {
      type: String
    },
    createdBy: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    size: {
      type: String,
      default: 'Large'
    },
    toppings: []
});
// We don't have to define the fields, as MongoDB will allow the data anyway, but for for clarity and usability, we should regulate what the data will look like.
// See how we don't have to use special imported data types for the type definitions?
// We simply instruct the schema that this data will adhere to the built-in JavaScript data types

// create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// exports the Pizza model
module.exports = Pizza; 
