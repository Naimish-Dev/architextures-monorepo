import express from "express";
import "dotenv/config";
import materialsRouter from "./src/routes/materials.router.js";
import generalRouter from "./src/routes/general.router.js";
import httpProxy from "http-proxy";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
if(process.env.NODE_ENV === "development"){
  app.use(express.static("public"));
}

app.use("/api/materials", materialsRouter);
app.use("/", generalRouter);

if (process.env.NODE_ENV !== "development") {
  const proxy = httpProxy.createProxyServer();
  app.use("/", (req, res) => {
    try {
      proxy.web(req, res, { target: process.env.FRONTEND_URL });
    } catch (error) {
      next(error);
    }
  });
}

app.use((error, req, res, next) => {
  res.status(500).json({
    message: "internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`backend server is running on http://localhost:${PORT}`);
});
