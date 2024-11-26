export default function index(req, res, next) {
  const uploadUrl = process.env.CDN_URL + "/put" + req.body.path;
  res.json({
    presignedUrl: uploadUrl,
  });
}
