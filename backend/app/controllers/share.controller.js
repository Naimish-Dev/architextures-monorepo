import ShareModel from "../models/share.model.js";

export async function index(req, res, next) {
  try {
    const id = req.params.id;
    const data = await ShareModel.findById(id);
    res.view.share({ params: data.params });
    return res.render("index");
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
