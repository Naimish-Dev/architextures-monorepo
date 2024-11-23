const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String, default: null },
  description: { type: String, default: "" },
  collection: { type: String, default: "" },
  thumbnail: { type: String, required: true },
  realwidth: { type: Number, required: true },
  realheight: { type: Number, default: 0 },
  pixelwidth: { type: Number },
  status: { type: String, enum: ["live", "archived"], default: "live" },
  user: { type: String, default: null },
  brand: { type: String, default: null },
  country: { type: String, default: null },
  seamless: { type: String, default: "1" },
  source_type: { type: String, default: "single" },
  json_data: { type: Object, default: {} }, // Allows any nested structure
  source_names: { type: [String], default: [] },
  color: { type: String, default: "" },
  link: { type: String, default: null },
  source_data: { type: Object, default: {} }, // Allows dynamic key-value pairs
  params: { type: Object, default: null },
  patterns: { type: Object, default: null },
  sku: { type: String, default: null },
  gallery_images: { type: [String], default: null },
  datasheet: { type: Object, default: {} },
  downloads: { type: Number, default: 0 },
  texture_sources: { type: Object, default: null }, // Flexible nested field
  brands_name: { type: String, default: null },
  brands_website_link: { type: String, default: null },
  brands_logo: { type: String, default: null },
  protextures_position_as_position: { type: Number, default: 0 },
});

const ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;
