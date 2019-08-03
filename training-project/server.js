const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");

const server = express();
server.use(express.static("public"));
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

server.get("/", (req, res) => {
  res.status(200).sendFile(path.resolve(__dirname + "/public/list.html"));
});

server.get("/list", (req, res) => {
  res.status(200).sendFile(path.resolve(__dirname + "/public/list.html"));
});

server.get("/list-infor", (req, res) => {
  fs.readFile("./data.json", (error, data) => {
    if (error) {
      res.status(500).send("Internal sever error");
    }
    res.status(200).json(JSON.parse(data));
  });
});

server.put("/list/:internId", async (req, res) => {
  const internId = req.params.internId;

  fs.readFile("./data.json", (error, data) => {
    if (error) {
      res.status(500).send("Internal sever error");
    }

    const interns = JSON.parse(data);
    if (req.body.type === "add_new") {
      interns.push({
        id: interns.length,
        name: "",
        phoneNumber: ""
      });
      res.status(200).end();
    } else {
      let updateInfor;
      for (let item of interns) {
        if (item.id === Number(internId)) {
          updateInfor = item;
          break;
        }
      }
      console.log(req.body);

      if (req.body.infor === "name") {
        updateInfor.name = req.body.value;
      } else {
        updateInfor.phoneNumber = req.body.value;
      }
    }

    fs.writeFile("./data.json", JSON.stringify(interns), (error, data) => {
      if (error) {
        res.status(500).send("Internal sever error");
      }
      res.status(200).send("Update Success!");
    });
  });
});

server.delete("/delete/:internId", (req, res) => {
  const internId = req.params.internId;
  fs.readFile("./data.json", (error, data) => {
    if (error) {
      res.status(500).send("Internal sever error");
    }

    const interns = JSON.parse(data);

    for (let item of interns) {
      if (item.id === Number(internId)) {
        interns.splice(Number(internId), 1);
        break;
      }
    }

    for (let item of interns) {
      if (item.id > Number(internId)) {
        item.id -= 1;
      }
    }

    fs.writeFile("./data.json", JSON.stringify(interns), (error, data) => {
      if (error) {
        res.status(500).send("Internal sever error");
      }
      res.status(200).send("Update Success!");
    });
  });
});


server.listen(3000, err => {
  if (err) {
    throw error;
  }
  console.log("Server listen on port 3000...");
});
