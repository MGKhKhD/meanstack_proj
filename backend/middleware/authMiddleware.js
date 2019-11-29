const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = {
      username: decodeToken.username,
      userId: decodeToken.id
    };
    next();
  } catch (err) {
    res.status(401).json({ message: "Auth failed"});
  }
};
