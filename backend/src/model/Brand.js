import mongoose from "mongoose";

const BrandSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String },
  description: { type: String },
  website_link: { type: String },
  logo: { type: String, default: null },
  country: { type: String },
  last_analytics_sent: { type: Date, default: null },
  stringId: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString(), // Generates a unique string
    unique: true,
  },
});

const BrandModel = mongoose.model("Brand", BrandSchema);
export default BrandModel;
