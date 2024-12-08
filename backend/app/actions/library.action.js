import LibraryModel from "../models/library.model.js";

export default async function index(req, res, next) {
  try {
    const body = req.body;
    body.image.replace("data:image/png;base64,", "");

    const payload = {
      name: body.name,
      params: body.params,
      category: body.category,
      user: req.user._id,
      type: body.type,
    };

    const library = await LibraryModel.create(payload);

    res.json({ id: library.id, status: "success" });
  } catch (error) {
    next(error);
  }
}
