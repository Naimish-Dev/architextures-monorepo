const mongoose = require("mongoose");

const HeightMapsSchema = new mongoose.Schema({
  id: { type: Number, unique: true }, // Unique numeric identifier
  name: { type: String }, // Product name
  image: { type: String, default: null }, // Path to the image
  user: { type: Number }, // Associated user ID
  brand: { type: String, default: null }, // Nullable brand field
  stringId: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString(), // Generates a unique string
    unique: true,
  },
});

// Export the model
const HeightMapsModel = mongoose.model("HeightMaps", HeightMapsSchema);
module.exports = HeightMapsModel;
