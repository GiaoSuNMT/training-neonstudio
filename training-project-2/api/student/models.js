const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  name: String,
  birth: Date,
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class"
  },
  province: String,
  ward: String,
  district: String,
  address: String,
  identityCard: String,
  authId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  cardAt: Date
});

const StudentModel = mongoose.model("Student", StudentSchema);

module.exports = StudentModel;
