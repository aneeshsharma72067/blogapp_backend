const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Blog Title is required"],
    unique: true,
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  user_id: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Blog", BlogSchema);
