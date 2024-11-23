import Material from "../model/Material.js";

export async function index(req, res, next) {
  try {
    const { page = 1, limit = 10, category = null, ids = null } = req.query;

    const query = {};

    if (category) {
      query.category = { $regex : new RegExp(category, "i") };
    }

    if (ids) {
      query.id = { $in: ids.split(",") };
    }

    const options = {
      limit,
      page,
    };

    const { docs, hasNextPage } = await Material.paginate(query, options);

    return res.json({
      more: hasNextPage,
      results: docs,
      status: "success",
    });
  } catch (error) {
    next(error);
  }
}