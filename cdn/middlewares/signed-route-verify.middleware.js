import crypto from "crypto";
import qs from "qs";

export function signedRouteVerify(req, res, next) {
  const { protocol, originalUrl } = req;
  const host = req.get("host");

  const [path, queryParamsString] = `${protocol}://${host}${originalUrl}`.split("?");
  if (!queryParamsString) {
    return res.status(400).json({ error: "bad_request" });
  }

  const queryParams = qs.parse(queryParamsString);
  const { expires, signature, failedRedirect } = queryParams;

  if (!expires || !signature) {
    return res.status(400).json({ error: "bad_request" });
  }

  delete queryParams.signature;
  const reconstructedQuery = qs.stringify(queryParams);
  const unsignedUrl = reconstructedQuery
    ? `${path}?${reconstructedQuery}`
    : path;

  const hmac = crypto.createHmac("sha256", process.env.APP_KEY);
  const expectedSignature = hmac.update(unsignedUrl).digest("hex");

  if (
    !crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expectedSignature, "hex")
    )
  ) {
    return res.status(400).json({ error: "invalid_signature" });
  }

  if (Number(expires) < Date.now()) {
    return res.status(410).json({ error: "link_expired" });
  }

  next();
}
