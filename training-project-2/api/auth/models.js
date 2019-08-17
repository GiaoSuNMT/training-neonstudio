const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  name: String,
  authId: String,
  numberLogin: Number,
  onlineAt: {
    type: Date,
    default: Date.now()
  }
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
