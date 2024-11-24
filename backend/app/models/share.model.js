import mongoose from "mongoose";

const shareSchema = new mongoose.Schema({
  params: { type: Object },
});

const ShareModel = mongoose.model("shares", shareSchema);
export default ShareModel;
