import mongoose from "mongoose";

const CollectionSchema = new mongoose.Schema({
  name: { type: String },
  position: { type: Number, default: null },
  user: { type: mongoose.Types.ObjectId, required: true },
  items: { type: Array, default: [] },
  totalTextures: { type: Number, default: 0 },
});

const CollectionModel = mongoose.model("Collections", CollectionSchema);
export default CollectionModel;
