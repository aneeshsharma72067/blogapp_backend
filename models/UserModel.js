const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Your email address is required"],
    unique: true,
  },
  name: {
    firstname: {
      type: String,
      required: [true, "Your name is required"],
    },
    lastname: {
      type: String,
    },
  },
  username: {
    type: String,
    required: [true, "Please Enter a username"],
  },
  password: {
    type: String,
    required: [true, "Your password is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

UserSchema.statics.signup = async function (email, name, username, password) {
  const userData = JSON.stringify(email, name, username, password);
  if (!email) {
    throw Error("Email is required !");
  }
  if (!username) {
    throw Error("Username is required !");
  }
  if (!name.firstname) {
    throw Error(`Firstname is required !`);
  }

  if (!validator.isEmail(email)) {
    throw Error("Email is not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error(`Password is weak!`);
  }
  const emailExists = await this.findOne({ email });
  const usernameExists = await this.findOne({ username });
  if (emailExists) {
    throw Error("Email already in use !!");
  }
  if (usernameExists) {
    throw Error("Username already taken !!");
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const user = await this.create({ email, name, username, password: hash });
  return user;
};

UserSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled");
  }
  const user = await this.findOne({ email });
  if (!user) {
    throw Error("User does not exists");
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Invalid login credentials");
  }
  return user;
};

module.exports = mongoose.model("User", UserSchema);
