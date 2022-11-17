const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signUp = async (
  username,
  fullname,
  email,
  gender,
  birthdate,
  password
) => {
  let user = await User.findOne({ _id: username });
  if (user) {
    return null;
  }
  user = await User.findOne({ email: email });
  if (user) {
    return null;
  }
  password = bcrypt.hashSync(password, bcrypt.genSaltSync());
  user = new User({
    _id: username,
    fullname: fullname,
    email: email,
    gender: gender,
    birthdate: birthdate,
    password: password,
  });
  await user.save();
  return user;
};

const signIn = async (username, password) => {
  const user = await User.findOne({ _id: username });
  if (!user) {
    return null;
  }
  const isSamePassword = bcrypt.compareSync(password, user.password);
  if (!isSamePassword) {
    return null;
  }
  const token = jwt.sign({ username }, process.env.SECRET, {
    expiresIn: parseInt(process.env.TIME_SESSION),
  });
  return token;
};

const signOut = async () => {
  return null;
};

const getUser = async (username) => {
  const user = await User.findOne({ _id: username });
  user.password = undefined;
  return user;
};

const deleteUser = async (username) => {
  return await User.deleteOne({ _id: username });
};

const editUser = async (
  username,
  fullname,
  email,
  gender,
  birthdate,
  password
) => {
  const user = await User.findOne({ email: email });
  if (user && user._id != username) {
    return null;
  }
  password = bcrypt.hashSync(password, bcrypt.genSaltSync());
  return await User.findOneAndUpdate(
    { _id: username },
    {
      $set: {
        fullname: fullname,
        email: email,
        gender: gender,
        birthdate: birthdate,
        password: password,
      },
    }
  );
};

module.exports = { signUp, signIn, signOut, getUser, deleteUser, editUser };
