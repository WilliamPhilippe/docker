const protect = async (req, res, next) => {
  const { user } = req.session;

  if (!user) {
    return res.status(401).json({
      status: "user not logged",
    });
  }

  req.user = user;

  next();
};

const logger = async (req, res, next) => {
  console.info("LOGGER:", req);

  next();
};

module.exports = { protectMiddleware: protect, logger };
