const mongoose = require("mongoose");

const SceneSchema = new mongoose.Schema({
  id: { type: Number, unique: true }, // Unique numeric identifier
  name: { type: String }, // Name of the scene
  svg: { type: String, default: null }, // Nullable SVG file path
  image: { type: String }, // Path to the image file
  mesh_file: { type: String }, // Path to the mesh file
  camera_file: { type: String }, // Path to the camera file
  camera_name: { type: String }, // Camera name
  fov: { type: Number }, // Field of view
  anchor_render: { type: [String] }, // Array of two numbers for render anchor
  anchor_3d: { type: [String] }, // Array of two numbers for 3D anchor
  scale: { type: Number }, // Scale factor
  crop_x: { type: Number }, // Crop x-coordinate
  crop_y: { type: Number }, // Crop y-coordinate
  crop_width: { type: Number }, // Crop width
  clip: { type: String, default: null }, // Clip file path
  mirror: { type: String, default: null }, // Mirror file path (nullable)
  params: { type: mongoose.Schema.Types.Mixed, default: null }, // Additional parameters (flexible type)
  stringId: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString(), // Generates a unique string
    unique: true,
  },
});

// Export the model
const ScenesModel = mongoose.model("Scene", SceneSchema);
module.exports = ScenesModel;
