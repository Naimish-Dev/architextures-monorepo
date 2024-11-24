import express from "express";
import "dotenv/config";
import path from "path"
import materialsRouter from "./app/routes/materials.router.js";
import patternsRouter from "./app/routes/patterns.router.js";
import generalRouter from "./app/routes/general.router.js";
import authRouter from "./app/routes/auth.router.js";
import httpProxy from "http-proxy";
import session from "express-session";
import passport from "passport";
import { ValidationException } from "./app/exceptions/validation.exception.js";
import { HttpException } from "./app/exceptions/http.exception.js";
import { globalExceptionHandler } from "./app/exceptions/global.exception.js";
import "./mongoose.js";

const app = express();
const PORT = process.env.PORT || 3000;
const proxy = httpProxy.createProxyServer();

app.disable("x-powered-by");
app.set('view engine', 'ejs');
app.set('views', path.resolve('views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('public'));
app.get('/', function(req, res) {
  res.render('index');
});

app.use("/auth", authRouter);
app.use("/api/materials", materialsRouter);
app.use("/api/patterns", patternsRouter);
app.use("/api", generalRouter);

app.use(ValidationException.handler);
app.use(HttpException.handler);
app.use(globalExceptionHandler);

app.listen(PORT, () => {
  console.log(`backend server is running on http://localhost:${PORT}`);
});
