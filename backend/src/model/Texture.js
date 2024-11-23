const mongoose = require("mongoose");

const TextureSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, default: null },
    brand: { type: Number, default: null },
    country: { type: String, default: null },
    width_mm: { type: Number, required: true },
    height_mm: { type: Number, required: true },
    active: { type: Boolean, default: null },
    params: { type: Object, default: {} }, // Directly store the `params` object
    imgurl: { type: String, required: true },
    type: { type: String, default: null },
    tags: { type: Array, default: [] }, // Directly store array of tags
    user: { type: Number, required: true },
    color: { type: String, default: "#cec4bc" },
    views: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
    materials: { type: String, required: true },
    sphere: { type: String, default: null },
    hatch: { type: String, default: null },
    published_at: { type: Date, required: true },
    created_at: { type: Date, required: true },
    updated_at: { type: Date, required: true },
    deleted_at: { type: Date, default: null },
    stringId: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString(), // Generates a unique string
      unique: true,
    },
  },
  { timestamps: true }
);

const TextureModel = mongoose.model("Texture", TextureSchema);
module.exports = TextureModel;
