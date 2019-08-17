const express = require("express");
const bcryptjs = require("bcryptjs");
const UserModel = require("./models");
const TokenModel = require("../token/models");
const jwt = require("jsonwebtoken");

const authRouter = express();

authRouter.post("/register", async (req, res) => {
  try {
    const userInfo = req.body;
    if (!userInfo.username || !userInfo.password) {
      res
        .status(201)
        .json({ message: "Vui lòng điền đầy đủ thông tin!", success: false });
    } else {
      const checkExist = await UserModel.findOne({ username: userInfo.username });
      if (!checkExist) {
        const hashPassword = await bcryptjs.hash(userInfo.password, 10);
        const newUser = await UserModel.create({
          ...userInfo,
          password: hashPassword
        });
        const userGetId = await UserModel.findOne({
          username: userInfo.username
        });
        const userUpdateId = await UserModel.findOneAndUpdate(
          { username: userInfo.username },
          { $set: { authId: userGetId._id } }
        );
        res.status(201).json(userUpdateId);
      } else {
        res
          .status(201)
          .json({ message: "Username đã tồn tại!", success: false });
      }
    }
  } catch (error) {
    res.status(500).end(error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const loginInfo = req.body;
    if (!loginInfo.username || !loginInfo.password) {
      res
        .status(201)
        .json({ message: "Vui lòng điền đầy đủ thông tin!", success: false });
    } else {
      const user = await UserModel.findOne({
        username: loginInfo.username
      }).exec();
      if (!user) {
        res.status(404).json({ message: "User not found", success: false });
      } else {
        const comparePassword = await bcryptjs.compare(
          loginInfo.password,
          user.password
        );
        if (comparePassword) {
          // success
          const token = jwt.sign(
            { username: user.username, authId: user._id },
            "secretkey",
            {
              expiresIn: "24h"
            }
          );
          const checkToken = await TokenModel.findOne({ authId: user._id });
          let expiredDate = new Date();
          expiredDate.setDate(expiredDate.getDate() + 1);
          if (!checkToken) {
            const newToken = TokenModel.create({
              authId: user._id,
              expiredAt: expiredDate,
              token: token
            });
          } else {
            await TokenModel.updateOne(
              { authId: user._id },
              {
                $set: {
                  expiredAt: expiredDate,
                  token: token
                }
              }
            );
          }
          const userLogin = await UserModel.findOneAndUpdate(
            { username: user.username },
            {
              $set: { onlineAt: new Date() }
            }
          );

          let checkTime = false;
          const interval = setInterval(async () => {
            const expiredUser = await TokenModel.findOne({
              authId: user._id
            });

            if (Date.now() > expiredUser.expiredAt.getTime()) {
              const deleteToken = await TokenModel.findOneAndDelete({
                authId: user._id
              });
              checkTime = true;
            }
            if (checkTime === true) {
              clearInterval(interval);
            }
          }, 60000);

          res
            .status(200)
            .json({ message: "Login Success", success: true, token: token });
        } else {
          // failed
          res.status(200).json({
            message: "Password isnt correct",
            success: false
          });
        }
      }
    }
  } catch (error) {
    res.status(500).end(error.message);
  }
});

authRouter.post("/test", verifyToken, async (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: "Success",
        authData
      });
    }
  });
});

authRouter.post("/logout", verifyToken, async (req, res) => {
  try {
    jwt.verify(req.token, "secretkey", async (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        const deleteToken = await TokenModel.findOneAndDelete({
          authId: authData.authId
        });
        if (deleteToken) {
          res.status(200).json({ message: "Logout Success", success: true });
        } else {
          res.status(200).json({ message: "Error!", success: false });
        }
      }
    });
  } catch (error) {
    res.status(500).end(error.message);
  }
});

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

module.exports = authRouter;
