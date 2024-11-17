const express = require("express");
const app = express();
const PORT = process.env.PORT || 8081;

app.use(express.json());
app.use(express.static("public"));

app.listen(PORT, () => {
  console.log(`cdn server is running on http://localhost:${PORT}`);
});
