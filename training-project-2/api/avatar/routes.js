const express = require("express");
const multer = require("multer");

const imageRouter = express();

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "image/");
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + ".jpg");
  }
});

var upload = multer({ storage: storage }).single("avatar");

imageRouter.post("/upload", function(req, res) {
  upload(req, res, function(err) {
    if (err) {
      throw err;
    } else {
      res.status(200).json({ message: "Upload Avatar Success", success: true });
    }
  });
});

module.exports = imageRouter;
