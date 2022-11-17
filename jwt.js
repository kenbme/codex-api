const jwt = require("jsonwebtoken");

function verifyToken(request, response, next) {
  const token = request.headers["x-access-token"];
  if (!token) {
    response.status(401).send("No token provided.");
  } else {
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        response.status(500).send("Failed to authenticate token.");
      } else {
        if (decoded.username != request.params.username) {
          response.status(403).send("Access denied.");
        } else {
          request.username = decoded.username;
          next();
        }
      }
    });
  }
}

module.exports = verifyToken;
