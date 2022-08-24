const express = require(`express`);
const mongoose = require(`mongoose`);
const config = require("./config/config");

const router = require("./routes/postRoutes");

mongoose
  .connect(
    `mongodb://${config.MONGO_USER}:${config.MONGO_PASSWORD}@${config.MONGO_IP}:${config.MONGO_PORT}/?authSource=admin`
  )
  .then(() => console.info("Database is connected"))
  .catch((e) => console.error(e));

const app = express();

app.use("/api/v1/post", router);

app.get("/", (req, res) => res.send("<h2>This is the response!!</h2>"));

const port = process.env.PORT || 3000;

app.listen(port, () => console.info(`server is running on ` + port));
