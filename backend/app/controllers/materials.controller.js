import Material from "../models/materials.model.js";

export async function index(req, res, next) {
  try {
    const {
      page = 1,
      limit = 10,
      category = null,
      ids = null,
      search = null,
    } = req.query;

    const query = {};

    if (category == "user_materials" && !req.isAuthenticated()) {
      return res.json({
        more: false,
        results: [],
        status: "success",
      });
    }

    if (category) {
      query.category = { $regex: new RegExp(category, "i") };
    }

    if (category == "user_materials") {
      query.user = req.user._id;
    }

    if (ids) {
      query.id = { $in: ids.split(",") };
    }

    if (search) {
      query.name = { $regex: new RegExp(category, "i") };
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

export async function create(req, res, next) {
  try {
    const body = req.body;
    body.source_names = JSON.parse(body.source_names);
    body.thumbnail = body.source_names[0];
    body.category = "user_materials";
    body.user = req.user._id;

    const materialModel = await Material.create(body);
    res.json({
      id: materialModel.id,
      status: "success",
    });
  } catch (error) {
    next(error);
  }
}
export async function update(req, res, next) {
  try {
    const body = req.body;
    const source_names = JSON.parse(body.source_names);

    const materialModel = await Material.findOne({id: req.params.id});
    materialModel.source_names = source_names;
    materialModel.save()

    res.json({
      status: "success",
    });
  } catch (error) {
    next(error);
  }
}
