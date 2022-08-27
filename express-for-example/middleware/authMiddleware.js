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

module.exports = { protectMiddleware: protect };
