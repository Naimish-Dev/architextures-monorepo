import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const librarySchema = new mongoose.Schema({
  name: { type: String, required: true },
  params: { type: Object, required: true },
  user: { type: mongoose.Types.ObjectId, required: true },
  category: { type: String, default: "" },
  imgurl: {type: String, default: ""},
  type: { type: String, required: true },
});

librarySchema.plugin(paginate);

const LibraryModel = mongoose.model("libraries", librarySchema);
export default LibraryModel;
