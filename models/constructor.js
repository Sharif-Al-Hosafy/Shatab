var mongoose = require("mongoose");

var constructorSchema = new mongoose.Schema({
  name: String,
  image: String,
  rating: Number,
  email: String,
  address: String,
  phonenumber: String,
  pricePerHour: String,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

module.exports = mongoose.model("Constructor", constructorSchema);
