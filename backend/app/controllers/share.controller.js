import ShareModel from "../models/share.model.js";

export async function index(req, res, next) {
  try {
    const id = req.params.id;
    const data = await ShareModel.findById(id);
    return res.render("index", { params: data.params });
  } catch (error) {
    next(error);
  }
}

export async function share(req, res, next) {
  try {
    const data = await ShareModel.create({ params: req.body.params });
    return res.json({ id: data.id });
  } catch (error) {
    next(error);
  }
}
