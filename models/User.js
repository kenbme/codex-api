const { model, Schema } = require("mongoose");

const User = model(
  "User",
  new Schema(
    {
      _id: String,
      username: String,
      fullname: String,
      email: String,
      gender: String,
      birthdate: Date,
      password: String,
    },
    { versionKey: false }
  ),
  "users"
);

module.exports = User;
