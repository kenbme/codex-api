const { model, Schema } = require("mongoose");

const Counter = model(
  "Counter",
  new Schema({
    _id: String,
    count: Number,
  }),
  "counters"
);

module.exports = Counter;
