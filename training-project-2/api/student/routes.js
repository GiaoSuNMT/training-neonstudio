const express = require("express");
const StudentModel = require("./models");
const TokenModel = require("../token/models");
const jwt = require("jsonwebtoken");

const studentRouter = express();

studentRouter.post("/list", verifyToken, async (req, res) => {
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
            const studentList = await StudentModel.find({})
              .populate("authId")
              .populate("classId")
              .exec();
            res.status(200).json(studentList);
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

studentRouter.post("/create", verifyToken, async (req, res) => {
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
            const studentInfo = req.body;
            const checkStudent = await StudentModel.findOne({
              identityCard: studentInfo.identityCard
            }).exec();
            if (checkStudent) {
              res
                .status(201)
                .json({ message: "Học sinh đã tồn tại!", success: false });
            } else {
              console.log(authData);
              const newStudent = await StudentModel.create({
                ...studentInfo,
                authId: authData.authId
              });
              res
                .status(200)
                .json({ message: "Create Student Success", success: true });
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

studentRouter.post("/delete", verifyToken, async (req, res) => {
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
            const deleteStudent = await StudentModel.findOneAndDelete({
              authId: authData.authId
            });
            res
              .status(200)
              .json({ message: "Delete Student Success", success: true });
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

studentRouter.post("/edit", verifyToken, async (req, res) => {
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
            const identityCard = req.query.identityCard;
            const checkStudent = await StudentModel.findOne({
              identityCard: identityCard
            }).exec();
            console.log(req.query.name, req.query.identityCard);
            if (!checkStudent) {
              const editStudent = await StudentModel.findOneAndUpdate(
                { authId: authData.authId },
                {
                  $set: { name: name, identityCard: identityCard }
                }
              );
              if (editStudent) {
                res
                  .status(200)
                  .json({ message: "Edit Student Success", success: true });
              } else {
                res.status(201).json({ message: "Error", success: false });
              }
            } else {
              res
                .status(201)
                .json({ message: "Error!", success: false });
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

module.exports = studentRouter;
