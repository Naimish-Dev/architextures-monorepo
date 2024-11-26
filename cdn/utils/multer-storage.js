import multer from "multer";
import { v4 as uuid4 } from "uuid";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const filepath = req.params[0];
    const fp = path.dirname(path.resolve(path.join("public", filepath)));

    if (!fs.existsSync(fp)) {
      fs.mkdirSync(fp, { recursive: true });
    }

    cb(null, fp);
  },
  filename: function (req, file, cb) {
    const filepath = req.params[0];
    const filename = path.basename(filepath)
    cb(null, filename);
  },
});

export const upload = multer({ storage: storage });
