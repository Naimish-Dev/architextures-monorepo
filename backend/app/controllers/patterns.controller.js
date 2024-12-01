import Pattern from "../models/patterns.model.js";

export async function index(req, res, next) {
  try {
    console.log(req);
    
    const { page = 1, limit = 20 } = req.query;

    const options = {
      limit,
      page,
    };

    const { docs, hasNextPage } = await Pattern.paginate({}, options);

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
    const data = await Pattern.find({ id: +req.params.id });

    res.json({ more: false, results: data, status: "success" });
  } catch (error) {
    next(error);
  }
}
