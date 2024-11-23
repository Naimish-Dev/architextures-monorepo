import express from "express";
import "dotenv/config";
import materialsRouter from "./src/routes/materials.router.js";
import patternsRouter from "./src/routes/patterns.router.js";
import generalRouter from "./src/routes/general.router.js";
import authRouter from "./src/routes/auth.router.js";
import httpProxy from "http-proxy";
import session from "express-session";
import passport from "passport";
import "./mongoose.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.disable("x-powered-by");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: true,
  })
);

if (process.env.NODE_ENV === "development") {
  app.use(express.static("public"));
}

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRouter);
app.use("/api/materials", materialsRouter);
app.use("/api/patterns", patternsRouter);
app.use("/api", generalRouter);

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
  console.log("error:", error);
  res.status(500).json({
    message: "internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`backend server is running on http://localhost:${PORT}`);
});
