import { temporarySignedRoute } from "../utils/helper.js";

export default function index(req, res, next) {
  const uploadUrl = process.env.CDN_URL + "/put" + req.body.path;
  const expiredAt = Date.now() + 30 * 1000;
  const signedUrl = temporarySignedRoute(uploadUrl, expiredAt, )
  res.json({
    presignedUrl: signedUrl,
  });
}
