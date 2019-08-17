const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema({
  id: Number,
  token: String,
  authId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  expiredAt: Date
});

const TokenModel = mongoose.model('Token', TokenSchema);

module.exports = TokenModel;  
