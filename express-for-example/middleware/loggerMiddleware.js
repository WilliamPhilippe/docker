const logger = async (req, res, next) => {
  console.info("LOGGER:", "yeah, it ran");

  next();
};

module.exports = { logger };
