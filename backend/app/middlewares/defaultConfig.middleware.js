import { countries } from "../utils/countries.js";
import geoip from "geoip-lite";
import useragent from "useragent";

export function defaultConfig(req, res, next) {
  const agent = useragent.parse(req.headers["user-agent"]);
  const browserName = agent.family;
  const browserVersion = agent.major;

  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const geo = geoip.lookup(ip);
  const userCountry = geo ? geo.country : "US";
  const userRegion = geo ? geo.region : "";
  const currentUser = req.user;
  const user = currentUser
    ? {
        id: currentUser._id,
        email: currentUser.email,
        first_name: currentUser.first_name,
        last_name: currentUser.last_name,
        parent: null,
        expires: null,
        brand: null,
        type: "user",
        params: null,
      }
    : false;

  const config = {
    mediaEndpoint: process.env.CDN_URL,
    titleSuffix: "Textures Pro",
    cdn: process.env.CDN_URL,
    initialPath: req.path,
    cdnOrigin: "https://config.nyc3.cdn.digitaloceanspaces.com",
    plugin: false,
    isInModel: false,
    isInSaves: false,
    user: user,
    units: "mm",
    keysPressed: {},
    pro: true,
    browserName,
    browserVersion,
    countries,
    userCountry,
    userRegion,
    industries: [
      "Architect",
      "Interior Designer",
      "Landscape Architect",
      "Engineer",
      "Builder/Contractor",
      "3D Artist",
      "Student",
      "Other",
    ],
  };

  res.view.share({ config });
  next();
}
