var jwt = require("jsonwebtoken");
module.exports = function(req, res, next) {
  // console.log(req.headers["authorization"]);
  req.headers.authorization = "bearer " + localStorage.getItem("token");
  // console.log(localStorage.getItem("token"));
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    var token = bearerToken;
    jwt.verify(token, "secretkey", function(err, authData) {
      
      if (err) {
        console.log(err);
        return res.redirect("/");
      } else {
        Token.findOne({ authId: authData.authId }, (err, checkToken) => {
          if (err) {
            throw err;
          } else {
            if (checkToken.token === token) {
              req.authData = authData;
              next();
            } else {
              return res.notFound("Error");
            }
          }
        });
      }
    });
  } else {
    res.status(404).json({
      message: "Error!"
    });
  }
};
