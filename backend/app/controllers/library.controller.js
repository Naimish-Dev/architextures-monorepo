import LibraryModel from "../models/library.model.js";
import { v4 as uuid } from "uuid";
import { temporarySignedRoute } from "../utils/helper.js";

export async function store(req, res, next) {
  try {
    const body = req.body;
    const base64Image = body.image;
    const imagePath = `/libraries/saves/${uuid()}.png`;
    const uploadUrl = process.env.CDN_URL + `/put${imagePath}`;
    const expiredAt = Date.now() + 10 * 1000;
    const signedUrl = temporarySignedRoute(uploadUrl, expiredAt);

    if (!/^data:image\/\w+;base64,/.test(base64Image)) {
      throw new Error("Invalid Base64 string format");
    }

    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    if (!buffer || buffer.length === 0) {
      throw new Error("Failed to create buffer from Base64 string");
    }

    const formData = new FormData();
    formData.append(
      "file",
      new Blob([buffer], { type: "image/png" }),
      "image.png"
    );

    const resp = await fetch(signedUrl, {
      method: "PUT",
      body: formData,
    });

    if (!resp.ok) {
      throw new Error("Image upload failed");
    }

    const payload = {
      name: body.name,
      params: body.params,
      category: body.category,
      user: req.user._id,
      imgurl: imagePath,
      type: body.type,
    };

    const library = await LibraryModel.create(payload);

    res.send(library.id);
  } catch (error) {
    next(error);
  }
}

export async function list(req, res, next) {
  try {
    const { page = 1, limit = 10 } = req.query;

    const options = {
      limit,
      page,
    };

    const query = {
      user: req.user._id,
      type: "save",
    };

    const { docs, hasNextPage } = await LibraryModel.paginate(query, options);

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
    const { page = 1, limit = 10 } = req.query;

    const options = {
      limit,
      page,
    };

    const query = {
      user: req.user._id,
      type: "save",
    };

    const { docs, hasNextPage } = await LibraryModel.paginate(query, options);

    return res.json({
      more: hasNextPage,
      results: docs,
      status: "success",
    });
  } catch (error) {
    next(error);
  }
}
