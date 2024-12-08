import LibraryModel from "../models/library.model.js";

export default async function index(req, res, next) {
  try {
    const query = req.query;
    if (query.save) {
      const data = await LibraryModel.findById(query.save);
      return res.render("create", { params: data.params });
    }

    return res.render("create");
  } catch (error) {
    next(error);
  }
}
