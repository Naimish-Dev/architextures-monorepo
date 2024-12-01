import express from "express";
import "dotenv/config";
import path from "path";
import engine from "express-edge";
import webRouter from "./routes/web.router.js";
import materialsRouter from "./routes/materials.router.js";
import patternsRouter from "./routes/patterns.router.js";
import apiRouter from "./routes/api.router.js";
import pathsRouter from "./routes/paths.router.js";
import heightRouter from "./routes/heightmaps.router.js";
import authRouter from "./routes/auth.router.js";
import session from "express-session";
import passport from "passport";
import { ValidationException } from "./app/exceptions/validation.exception.js";
import { HttpException } from "./app/exceptions/http.exception.js";
import { globalExceptionHandler } from "./app/exceptions/global.exception.js";
import "./mongoose.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.disable("x-powered-by");

app.use(engine);
app.set("views", path.resolve("views"));

if (process.env.NODE_ENV === "production") {
  app.enable("view cache");
}

app.use(express.urlencoded({ extended: true, limit: "3mb" }));
app.use(express.json({ limit: "3mb" }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static("public"));
app.use(webRouter);
app.use("/auth", authRouter);
app.use("/api/materials", materialsRouter);
app.use("/api/patterns", patternsRouter);
app.use("/api", apiRouter);
app.use("/api/paths", pathsRouter);
app.use("/api/heightmaps", heightRouter);

app.get("/*", (req, res) => {
  return res.render("errors.404");
});

app.use(ValidationException.handler);
app.use(HttpException.handler);
app.use(globalExceptionHandler);

app.listen(PORT, () => {
  console.log(`backend server is running on http://localhost:${PORT}`);
});
