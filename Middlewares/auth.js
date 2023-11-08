const jwt = require("jsonwebtoken");



// Middleware to decode and verify the token
exports.verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, "fazi5566", (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Token verification failed" });
    }
    req.userId = decoded.userId; // Make userId available in the request object
    next();
  });
};



exports.isLoggedIn = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ error: "Token is not found" });
  } else {
    jwt.verify(token, "fazi5566", (err, decoded) => {
      if (err) {
        return res.json({ error: "token is invalid" });
      } else {
        return next();
      }
    });
  }
};
exports.isLoggedOut = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return next()
  } else {
    jwt.verify(token, "fazi5566", (err, decoded) => {
      if (err) {
        return res.json({ error: "Token is invalid" });
      } else {
        return res.json({error:'token exists'})
      }
    });
  }
};

exports.isAdminLoggedIn = async (req, res, next) => {
  const token = req.cookies.AdminToken;
  if (!token) {
    return res.json({ error: "Admintoken is not found" });
  } else {
    jwt.verify(token, "fazi5566", (err, decoded) => {
      if (err) {
        return res.json({ error: "token is invalid" });
      } else {
        return next();
      }
    });
  }
};
exports.isAdminLoggedOut = async (req, res, next) => {
  const token = req.cookies.AdminToken;
  if (!token) {
    return next();
  } else {
    jwt.verify(token, "fazi5566", (err, decoded) => {
      if (err) {
        return res.json({ error: "Admintoken is invalid" });
      } else {
        return res.json({ error: "Admintoken is not found" });
      }
    });
  }
};
