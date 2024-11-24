import Material from "../models/materials.model.js";

export async function index(req, res, next) {
  try {
    const { page = 1, limit = 10, category = null, ids = null, search = null } = req.query;

    const query = {};

    if (category) {
      query.category = { $regex : new RegExp(category, "i") };
    }

    if (ids) {
      query.id = { $in: ids.split(",") };
    }

    if(search){
      query.name = { $regex : new RegExp(category, "i") }
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