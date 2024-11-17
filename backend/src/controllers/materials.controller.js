import { createRequire } from "module";
const require = createRequire(import.meta.url);
const db = require("../db.json");

export async function index(req, res, next) {
  try {
    const page = +req.body?.page || 0;
    const limit = +req.body?.limit || 20;
    const offset = limit * page;
    const endIndex = offset + limit;
    const category = req.body.category.toLocaleLowerCase() || "stone";
    const materials = db.materials.filter(
      (v) => v.category.toLocaleLowerCase() == category
    );

    const data = materials.slice(offset, endIndex);
    res.json({
      more: endIndex < materials.length,
      results: data,
      status: "success",
    });
  } catch (error) {
    next(error);
  }
}

export async function show(req, res, next) {
  try {
    const data = db.materials.filter((texture) => {
      return +req.params.id === texture.id;
    });
    res.json({ more: false, results: data, status: "success" });
  } catch (error) {
    next(error);
  }
}
