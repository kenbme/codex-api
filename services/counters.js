const Counter = require("../models/Counter");

const addTo = async (collection) => {
  var counter = await Counter.findOne({ _id: collection });
  var count = 1;
  if (!counter) {
    counter = new Counter({ _id: collection, count: count });
    await counter.save();
  } else {
    count = counter.count + 1;
    await Counter.updateOne({ _id: collection }, { $set: { count: count } });
  }
  return count;
};

module.exports = { addTo };
