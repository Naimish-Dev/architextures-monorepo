import { Edge } from "edge.js";
import path from "path"

const edge = Edge.create({
  cache: process.env.NODE_ENV !== "development"
})

edge.mount(path.resolve("views"))

export function edgeMiddleware(req, res, next) {
  res.view = edge.createRenderer();
  res.render = async function (view, options = {}, callback) {
    try {
      res.view.share(options)
      const html = await res.view.render(view.replace(/\./g, '/'));

      if (callback) {
        return callback(null, html);
      }

      return this.send(html);
    } catch (err) {
      if (callback) {
        return callback(err);
      }
      return next(err);
    }
  };
  next();
}
