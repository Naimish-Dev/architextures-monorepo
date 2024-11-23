const mongoose = require("mongoose");

const PathSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true }, // Unique numeric identifier
  name: { type: String }, // Name of the Path
  points: {
    type: [[Number]], // Array of point arrays, each containing two numbers (x, y)
    required: true,
  },
  svg: { type: String, default: null }, // Path to the SVG file
  stringId: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString(), // Generates a unique string
    unique: true,
  },
});

// Export the model
const PathModel = mongoose.model("Path", PathSchema);
module.exports = PathModel;
