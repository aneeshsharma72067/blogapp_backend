const express = require("express");
const router = express.Router();
const Blog = require("../../models/BlogModel");
const requireAuth = require("../../middleware/requireAuth");
const multer = require("multer");
const uploads = multer({ dest: "uploads/" });
const fs = require("fs");
const path = require("path");

router.get("/", (req, res) => {
  Blog.find({})
    .sort({ createdAt: -1 })
    .then((blogs) => res.json(blogs))
    .catch((err) => res.status(400).json({ msg: err.message }));
});

router.get("/blog/:id", (req, res) => {
  Blog.findById(req.params.id)
    .then((blog) => res.json(blog))
    .catch((err) => res.status(400).json({ msg: "Blog Not Found" }));
});
router.use(requireAuth);

router.get("/my-blogs", (req, res) => {
  const user_id = req.user._id;
  Blog.find({ user_id })
    .sort({ createdAt: -1 })
    .then((blogs) => res.json(blogs))
    .catch((err) => res.status(400).json({ error: err }));
});

router.post("/", uploads.single("image"), (req, res) => {
  const { title, content, category } = req.body;
  if (!title) {
    res.status(400).json({ error: "Please Enter a Title !!" });
    return;
  }
  if (category == "0") {
    res.status(400).json({ error: "Please select a valid category !!" });
    return;
  }
  if (!category) {
    res.status(400).json({ error: "Please select a valid category !!" });
    return;
  }
  if (!content) {
    res.status(400).json({ error: "Please Enter some Content !!" });
    return;
  }
  if (!req.file) {
    res.status(400).json({ error: `Please select an Image !! ${req.file}` });
    return;
  }
  const user_id = req.user._id;
  const imageUrl = req.file.path;
  Blog.create({ title, content, category, user_id, imageUrl })
    .then(() =>
      res.json({
        msg: "Blog Created Successfully",
        req: {
          body: req.body,
          user: req.user,
        },
      })
    )
    .catch((err) => res.status(400).json({ error: err, req: req }));
});

router.delete("/", (req, res) => {
  Blog.deleteMany({})
    .then(() => res.json({ msg: "All Blogs Removed" }))
    .catch((err) => res.status(400).json({ error: err }));
});

router.delete("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  const imgUrl = blog.imageUrl;
  const imageId = imgUrl.slice(8, imgUrl.length);

  Blog.findByIdAndRemove(req.params.id)
    .then(() => {
      fs.unlinkSync(`./uploads/${imageId}`);
      res.json({ msg: "Blog Deleted Successfully" });
    })
    .catch((err) => res.status(400).json({ msg: "No such a blog" }));
});

router.put("/:id", (req, res) => {
  Blog.findByIdAndUpdate(req.params.id, req.body)
    .then(() => res.json({ msg: "Blog Successfully Updated" }))
    .catch((err) => res.status(400).json({ msg: "Can not find such blog." }));
});

module.exports = router;
