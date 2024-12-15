import CollectionModel from "../models/collections.model.js";
import LibraryModel from "../models/library.model.js";

export async function index(req, res, next) {
  try {
    const collectionModel = await CollectionModel.find(
      {
        user: req.user._id,
      },
      ["_id", "name", "position", "totalTextures", "user"]
    ).sort({ position: 1 });

    res.json({
      more: true,
      results: collectionModel,
      status: "success",
    });
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    const body = req.body;
    const collectionModel = await CollectionModel.create({
      name: body.name,
      user: req.user._id,
    });
    return res.json({
      id: collectionModel.id,
      success: true,
    });
  } catch (error) {
    next(error);
  }
}

export async function position(req, res, next) {
  try {
    const params = req.params;
    const collectionModel = await CollectionModel.findById(params.id);
    const libraryModel = await LibraryModel.find({
      _id: {
        $in: collectionModel.items,
      },
    });
    res.json(
      libraryModel.map((val) => {
        return {
          color: val.name,
          imgurl: val.imgurl,
        };
      })
    );
  } catch (error) {
    next(error);
  }
}

export async function rearrange(req, res, next) {
  try {
    const body = req.body;

    for (const index in body.positions) {
      await CollectionModel.findByIdAndUpdate(body.positions[index], {
        position: index,
      });
    }

    res.json({
      status: "success",
    });
  } catch (error) {
    next(error);
  }
}

export async function rename(req, res, next) {
  try {
    const params = req.params;
    const collectionModel = await CollectionModel.findById(params.id);
    collectionModel.name = req.body.name;
    collectionModel.save();
    res.json({
      status: "success",
    });
  } catch (error) {
    next(error);
  }
}

export async function rearrangeItem(req, res, next) {
  try {
    const params = req.params;
    const collectionModel = await CollectionModel.findById(params.id);
    collectionModel.items = req.body.positions;
    collectionModel.save();
    res.json({
      status: "success",
    });
  } catch (error) {
    next(error);
  }
}

export async function items(req, res, next) {
  try {
    const params = req.params;
    const collectionModel = await CollectionModel.findById(params.id);
    console.log("collectionModel.items", collectionModel.items);
    const libraryModel = await LibraryModel.find({
      _id: {
        $in: collectionModel.items,
      },
    });
    res.json({
      results: libraryModel.sort((a, b) => {
        return (
          collectionModel.items.findIndex((v) => v == a._id) -
          collectionModel.items.findIndex((v) => v == b._id)
        );
      }),
      collectionName: collectionModel.name,
    });
  } catch (error) {
    next(error);
  }
}

export async function attachItem(req, res, next) {
  try {
    const params = req.params;
    const collectionModel = await CollectionModel.findById(params.id);
    collectionModel.items.push(params.item);
    collectionModel.totalTextures = collectionModel.items.length;
    collectionModel.save();
    res.json({
      id: params.id,
      status: "success",
    });
  } catch (error) {
    next(error);
  }
}

export async function destroy(req, res, next) {
  try {
    await CollectionModel.findByIdAndDelete(req.params.id);
    res.json({
      status: "success",
    });
  } catch (error) {
    next(error);
  }
}

export async function destroyItem(req, res, next) {
  try {
    const params = req.params;
    const collectionModel = await CollectionModel.findById(params.id);
    collectionModel.items = collectionModel.items.filter(
      (val) => val != params.item
    );
    collectionModel.totalTextures = collectionModel.items.length;
    collectionModel.save();
    res.json({
      status: "success",
    });
  } catch (error) {
    next(error);
  }
}
