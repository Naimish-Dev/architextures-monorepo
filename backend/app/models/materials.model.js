import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const materialSchema = new mongoose.Schema({
  id: { type: Number, default: Date.now },
  name: { type: String },
  category: { type: String },
  subcategory: { type: String, default: null },
  description: { type: String, default: "" },
  collection: { type: String, default: "" },
  thumbnail: { type: String },
  realwidth: { type: Number, default: 0 },
  realheight: { type: Number, default: 0 },
  pixelwidth: { type: Number, default: 0 },
  status: { type: String },
  user: { type: mongoose.Schema.Types.Mixed, default: null },
  brand: { type: mongoose.Schema.Types.Mixed, default: null },
  country: { type: mongoose.Schema.Types.Mixed, default: null },
  seamless: { type: String, default: "0" },
  source_type: { type: String, default: "single" },
  json_data: { type: Object, default: {} },
  source_names: { type: [String], default: [] },
  color: { type: String, default: "" },
  link: { type: String, default: null },
  source_data: { type: mongoose.Schema.Types.Mixed, default: null },
  params: { type: mongoose.Schema.Types.Mixed, default: null },
  patterns: { type: mongoose.Schema.Types.Mixed, default: null },
  sku: { type: mongoose.Schema.Types.Mixed, default: null },
  gallery_images: { type: [String], default: [] },
  datasheet: { type: mongoose.Schema.Types.Mixed, default: null },
  downloads: { type: Number, default: 0 },
  texture_sources: { type: mongoose.Schema.Types.Mixed, default: null },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
  brands_name: { type: String, default: null },
  brands_website_link: { type: String, default: null },
  brands_logo: { type: String, default: null },
  protextures_position_as_position: { type: Number, default: null },
});

materialSchema.plugin(paginate);

const MaterialModel = mongoose.model("Material", materialSchema);

export default MaterialModel;
