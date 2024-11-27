import HeightMapsModel from "../models/heightmaps.model.js";

export async function index(req, res, next) {
  try {
    const { page = 1, limit = 10 } = req.query;

    const options = {
      limit,
      page,
    };

    const { docs, hasNextPage } = await HeightMapsModel.paginate({}, options);

    return res.json({
      more: hasNextPage,
      results: docs,
      status: "success",
    });
  } catch (error) {
    next(error);
  }
}

export async function show(req, res, next) {
  try {
    const data = await HeightMapsModel.find({ id: +req.params.id });

    res.json({ more: false, results: data, status: "success" });
  } catch (error) {
    next(error);
  }
}
