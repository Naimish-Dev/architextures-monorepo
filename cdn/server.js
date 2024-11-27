import express from "express";
import cors from "cors";
import "dotenv/config";
import { upload } from "./utils/multer-storage.js";

const app = express();
const PORT = process.env.PORT || 8081;

app.use(
  cors({
    origin: process.env.BACKEND_URL,
  })
);
app.use(express.json());
app.use(express.static("public"));
app.put("/put/*", upload.any(), (req, res, next) => {
  const url = `${process.env.APP_URL}/${req.params[0]}`;
  res.json({
    url,
  });
});

app.listen(PORT, () => {
  console.log(`cdn server is running on http://localhost:${PORT}`);
});
