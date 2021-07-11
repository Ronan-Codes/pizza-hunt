// We could import the entire mongoose library, but we only need to worry about the Schema constructor and model function
const { schema, model, Schema } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const PizzaSchema = new Schema(
  {
    pizzaName: {
      type: String,
      // validation - set to true or custom message
      // don't forget to include runValidators: true in pizza-controllers routes (except create)
      required: 'You need to provide a pizza name!',
      // works like JV .trim() (Good for username & pass)
      trim: true
    },
    createdBy: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      // make sure to import functions used in get (dateFormat) and activate getters in toJSON below
      get: (createdAtVal) => dateFormat(createdAtVal)
    },
    size: {
      type: String,
      required: true,
      enum: ['Personal', 'Small', 'Medium', 'Large', 'Extra Large'],
      default: 'Large'
    },
    toppings: [],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
      }
    ]
  },
  {
    // tells schema that it can use virtuals
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false
    // We set id to false because this is a virtual that Mongoose returns, and we don’t need it.
  }
);
// We don't have to define the fields, as MongoDB will allow the data anyway, but for for clarity and usability, we should regulate what the data will look like.
// See how we don't have to use special imported data types for the type definitions?
// We simply instruct the schema that this data will adhere to the built-in JavaScript data types

// get total count of comments and replies on retrieval 
PizzaSchema.virtual('commentCount').get(function() {
  // return this.comments.length;
  return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0);
});

// create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// exports the Pizza model
module.exports = Pizza; 
