import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 8081;

app.use(
  cors({
    origin: process.env.BACKEND_URL,
  })
);
app.use(express.json());
app.use(express.static("public"));

app.listen(PORT, () => {
  console.log(`cdn server is running on http://localhost:${PORT}`);
});
