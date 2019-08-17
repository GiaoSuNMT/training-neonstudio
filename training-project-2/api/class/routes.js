const express = require("express");
const ClassModel = require("./models");
const TokenModel = require("../token/models");
const jwt = require("jsonwebtoken");

const classRouter = express();

classRouter.post("/create", verifyToken, async (req, res) => {
  try {
    jwt.verify(req.token, "secretkey", async (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        const checkToken = await TokenModel.findOne({
          authId: authData.authId
        });
        if (!checkToken) {
          res.status(201).json({ message: "Yêu cầu Login!", success: false });
        } else {
          if (req.token === checkToken.token) {
            const classInfo = req.body;
            const checkclass = await ClassModel.findOne({
              name: classInfo.name
            }).exec();
            if (checkclass) {
              res
                .status(201)
                .json({ message: "Lớp đã tồn tại!", success: false });
            } else {
              const newclass = await ClassModel.create({
                ...classInfo
              });
              res
                .status(200)
                .json({ message: "Create class Success", success: true });
            }
          } else {
            res.status(201).json({ message: "Yêu cầu Login!", success: false });
          }
        }
      }
    });
  } catch (error) {
    res.status(500).end(error.message);
  }
});

classRouter.post("/delete", verifyToken, async (req, res) => {
  try {
    jwt.verify(req.token, "secretkey", async (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        const checkToken = await TokenModel.findOne({
          authId: authData.authId
        });
        if (!checkToken) {
          res.status(201).json({ message: "Yêu cầu Login!", success: false });
        } else {
          if (req.token === checkToken.token) {
            const deleteClass = await ClassModel.findOneAndDelete({
              classId: req.query.classId
            });
            res
              .status(200)
              .json({ message: "Delete class Success", success: true });
          } else {
            res.status(201).json({ message: "Yêu cầu Login!", success: false });
          }
        }
      }
    });
  } catch (error) {
    res.status(500).end(error.message);
  }
});

classRouter.post("/edit", verifyToken, async (req, res) => {
  try {
    jwt.verify(req.token, "secretkey", async (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        const checkToken = await TokenModel.findOne({
          authId: authData.authId
        });
        if (!checkToken) {
          res.status(201).json({ message: "Yêu cầu Login!", success: false });
        } else {
          if (req.token === checkToken.token) {
            const name = req.query.name;
            const group = req.query.group;
            const editclass = await ClassModel.findOneAndUpdate(
              { classId: req.query.classId },
              {
                $set: { name: name, group: group }
              }
            );
            if (!editclass) {
              res.status(201).json({ message: "Error!", success: false });
            } else {
              res
                .status(200)
                .json({ message: "Edit class Success", success: true });
            }
          } else {
            res.status(201).json({ message: "Yêu cầu Login!", success: false });
          }
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

module.exports = classRouter;
