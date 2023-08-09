const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
// .env file path setup
dotenv.config({ path: "./.env" });

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);

    const username = user.username;
    const name = user.name;
    // create a token
    const token = createToken(user._id);
    res.status(200).json({ email, name, username, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const signupUser = async (req, res) => {
  const { email, name, username, password } = req.body;
  try {
    const user = await User.signup(email, name, username, password);

    // creating a token
    const token = createToken(user._id);
    res.status(200).json({ email, name, username, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { signupUser, loginUser };
