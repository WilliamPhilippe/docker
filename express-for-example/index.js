const express = require(`express`);
const mongoose = require(`mongoose`);
const session = require("express-session");
const redis = require("redis");
const cors = require("cors");
const config = require("./config/config");

let RedisStore = require("connect-redis")(session);
const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");
const { logger } = require("./middleware/loggerMiddleware");

const up = async () => {
  let redisClient = redis.createClient({
    url: "redis://redis:6379",
    legacyMode: true,
  });

  await redisClient.connect();

  mongoose
    .connect(
      `mongodb://${config.MONGO_USER}:${config.MONGO_PASSWORD}@${config.MONGO_IP}:${config.MONGO_PORT}/?authSource=admin`
    )
    .then(() => console.info("Database is connected"))
    .catch((e) => console.error(e));

  const app = express();

  app.enable("trust proxy");
  app.use(cors({}));
  app.use(express.json());

  app.use(
    session({
      store: new RedisStore({
        client: redisClient,
      }),
      secret: "secret",
      cookie: {
        resave: false,
        secure: false,
        saveUninitialized: false,
        httpOnly: true,
        maxAge: 30000,
      },
    })
  );

  app.use(logger);

  app.use("/api/v1/post", postRoutes);
  app.use("/api/v1/users", userRoutes);

  app.get("/api", (req, res) => res.send("<h2>This is the response!!</h2>"));

  const port = process.env.PORT || 3000;

  app.listen(port, () => console.info(`server is running on ` + port));
};

up().catch((err) => console.error(err));
