const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authRouter = require("./api/auth/routes");
const studentRouter = require("./api/student/routes");
const classRouter = require("./api/class/routes");
const imageRouter = require("./api/avatar/routes");

mongoose.connect("mongodb://localhost:27017/training-project", error => {
  if (error) throw error;

  const app = express();

  // middlewares
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  // routes
  app.use("/api/auth", authRouter);
  app.use("/api/student", studentRouter);
  app.use("/api/class", classRouter);
  app.use("/api/avatar", imageRouter);

  app.listen(3000, error => {
    if (!error) {
      console.log("Server listen on port 3000...");
    }
  });
});
