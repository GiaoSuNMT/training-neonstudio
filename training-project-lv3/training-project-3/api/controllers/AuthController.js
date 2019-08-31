/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var bcryptjs = require("bcryptjs");
var jwt = require("jsonwebtoken");

module.exports = {
  register: function(req, res) {
    res.view("register");
  },
  create: async function(req, res) {
    try {
      const userInfo = req.body;
      if (!userInfo.username || !userInfo.password) {
        res
          .status(201)
          .json({ message: "Vui lòng điền đầy đủ thông tin!", success: false });
      } else {
        const checkExist = await Auth.findOne({
          username: userInfo.username
        });
        if (!checkExist) {
          const hashPassword = await bcryptjs.hash(userInfo.password, 10);
          const newUser = await Auth.create({
            ...userInfo,
            password: hashPassword
          });
          const userGetId = await Auth.findOne({
            username: userInfo.username
          });
          const userUpdateId = await Auth.update(
            { username: userInfo.username },
            { authId: userGetId.id }
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
  },
  login: function(req, res) {
    res.view("login");
  },
  userLogin: async function(req, res) {
    try {
      const loginInfo = req.body;
      if (!loginInfo.username || !loginInfo.password) {
        res
          .status(201)
          .json({ message: "Vui lòng điền đầy đủ thông tin!", success: false });
      } else {
        const user = await Auth.findOne({
          username: loginInfo.username
        });
        if (!user) {
          res.status(404).json({ message: "User not found", success: false });
        } else {
          const comparePassword = await bcryptjs.compare(
            loginInfo.password,
            user.password
          );

          if (comparePassword) {
            const token = jwt.sign(
              { username: user.username, authId: user.id },
              "secretkey",
              {
                expiresIn: "24h"
              }
            );
            const checkToken = await Token.findOne({ authId: user.id });
            let expiredDate = new Date();
            expiredDate.setDate(expiredDate.getDate() + 1);
            if (!checkToken) {
              const newToken = await Token.create({
                authId: user.id,
                expiredAt: expiredDate,
                token: token
              });
            } else {
              await Token.update(
                { authId: user.id },
                {
                  expiredAt: expiredDate,
                  token: token
                }
              );
            }

            const userLogin = await Auth.update(
              { username: user.username },
              {
                onlineAt: new Date()
              }
            );

            let checkTime = false;
            const interval = setInterval(async () => {
              const expiredUser = await Token.findOne({
                authId: user.id
              });
              if (expiredUser) {
                if (Date.now() > expiredUser.expiredAt.getTime()) {
                  const deleteToken = await Token.destroy({
                    authId: user.id
                  });
                  checkTime = true;
                }
                if (checkTime === true) {
                  clearInterval(interval);
                }
              } else {
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
  },
  logout: async function(req, res) {
    try {
      // res.status(200).json({
      //   message: "Success",
      //   success: true
      // });
      const authData = req.authData;
      const deleteToken = await Token.destroy({
        authId: authData.authId
      });
      console.log(deleteToken.length);
      console.log(authData);

      if (!deleteToken.length) {
        res.status(200).json({ message: "Error!", success: false });
      } else {
        res.status(200).json({ message: "Logout Success", success: true });
      }
    } catch (error) {
      res.status(500).end(error.message);
    }
  }
};
