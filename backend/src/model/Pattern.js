const mongoose = require("mongoose");

const PatternSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  stringId: { type: String, default: null },
  name: { type: String },
  description: { type: String, default: null },
  categories: { type: Array, default: [] },
  brand: { type: Number, default: null },
  svg: { type: String, default: null },
  rowMultiple: { type: String },
  columnMultiple: { type: String },
  dimType: { type: String },
  thumbnailSize: { type: String },
  tileHeightMin: { type: String, default: null },
  active: { type: Number, default: false },
  pro: { type: Number, default: false },
  uiHide: { type: String, default: null },
  uiShow: { type: String, default: null },
  drawMethod: { type: String },
  hatchJoints: { type: String, default: null },
  hatchEdges: { type: String, default: null },
  hatchMinGrid: { type: Number },
  definition: { type: Object, default: {} }, // Flexible for nested objects
});

const PatternModel = mongoose.model("Pattern", PatternSchema);

module.exports = PatternModel;
