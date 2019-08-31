var jwt = require("jsonwebtoken");
module.exports = function(req, res, next) {
  // console.log(req.headers["authorization"]);
  const bearerHeader = req.headers["authorization"];
  // console.log(bearerHeader);
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    var token = bearerToken;
    jwt.verify(token, "secretkey", function(err, authData) {
      if (err) {
        return res.json(401, { err: "Invalid token" });
      } else {
        // console.log(authData);
        req.authData = authData;
        next();
      }
    });
  } else {
    res.status(404).json({
      message: "Bạn chưa Login!"
    });
  }
};
