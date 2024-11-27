export default function index(req, res, next) {
  res.json({
    success: true,
    hasStorage: true,
    used: 0,
    limit: 100,
  });
}
