const { model, Schema } = require("mongoose");

const Counter = model(
  "Counter",
  new Schema(
    {
      _id: String,
      count: Number,
    },
    { versionKey: false }
  ),
  "counters"
);

module.exports = Counter;
