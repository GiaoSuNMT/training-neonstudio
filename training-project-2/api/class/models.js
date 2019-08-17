const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema({
  name: String,
  group: String,
  classId: String
});

const ClassModel = mongoose.model("Class", ClassSchema);

module.exports = ClassModel;
