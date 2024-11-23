const mongoose = require("mongoose");

const TextureSourcesSchema = new mongoose.Schema({
  id: { type: Number, unique: true }, // Unique numeric identifier
  width_mm: { type: Number }, // Width in millimeters
  width_px: { type: Number, default: null }, // Width in pixels, nullable
  seamless: { type: Boolean }, // Seamless flag (boolean)
  user: { type: Number }, // User ID
  brand: { type: Number }, // Brand ID
  name: { type: String }, // Name of the texture
  texture_map: { type: String }, // Path to texture map
  displacement_map: { type: String, default: null }, // Path to displacement map, nullable
  bump_map: { type: String, default: null }, // Path to bump map, nullable
  normal_map: { type: String, default: null }, // Path to normal map, nullable
  roughness_map: { type: String, default: null }, // Path to roughness map, nullable
  metalness_map: { type: String, default: null }, // Path to metalness map, nullable
  stringId: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString(), // Generates a unique string
    unique: true,
  },
});

// Export the model
const TextureSourcesModel = mongoose.model(
  "TextureSource",
  TextureSourcesSchema
);
export default TextureSourcesModel;
