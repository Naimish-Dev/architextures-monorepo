import { createRequire } from "module";
const require = createRequire(import.meta.url);
const db = require("../db.json");

export async function index(req, res, next) {
  try {
    const page = +req.body?.page || 0;
    const limit = +req.body?.limit || 20;
    const offset = limit * page;
    const endIndex = offset + limit;
    const patterns = db.patterns

    const data = patterns.slice(offset, endIndex);
    res.json({
      more: endIndex < patterns.length,
      results: data,
      status: "success",
    });
  } catch (error) {
    next(error);
  }
}

export async function show(req, res, next) {
  try {
    const data = db.patterns.filter((texture) => {
      return +req.params.id === texture.id;
    });
    res.json({ more: false, results: data, status: "success" });
  } catch (error) {
    next(error);
  }
}
