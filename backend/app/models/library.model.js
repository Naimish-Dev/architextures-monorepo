import mongoose from "mongoose";

const librarySchema = new mongoose.Schema({
  name: { type: String, required: true },
  params: { type: Object, required: true },
  user: { type: mongoose.Types.ObjectId, required: true },
  category: { type: String, default: "" },
  type: { type: String, required: true },
});

const libraryModel = mongoose.model("libraries", librarySchema);
export default libraryModel;
