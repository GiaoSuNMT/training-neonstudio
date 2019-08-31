/**
 * StudentController
 *
 * @description :: Server-side logic for managing students
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  list: function(req, res) {
    try {
      if (req.body) {
        Student.find({
          name: { $regex: new RegExp(req.body.search) }
        }).exec(function(err, student) {
          if (err) {
            res.send(501, { error: "Database Error" });
          }
          res.view("list", { student: student });
        });
      } else {
        Student.find({}).exec(function(err, student) {
          if (err) {
            res.send(500, { error: "Database Error" });
          }
          res.view("list", { student: student });
        });
      }
    } catch (error) {
      res.status(500).end(error.message);
    }
  },
  add: function(req, res) {
    try {
      res.view("add");
    } catch (error) {
      res.status(500).end(error.message);
    }
  },
  create: async function(req, res) {
    try {
      var name = req.body.name;
      var identityCard = req.body.identityCard;

      if (!name || !identityCard) {
        res
          .status(201)
          .json({ message: "Vui lòng điền đầy đủ thông tin!", success: false });
      } else {
        const checkStudent = await Student.findOne({
          identityCard: identityCard
        });
        if (checkStudent) {
          res
            .status(201)
            .json({ message: "Học sinh đã tồn tại!", success: false });
        } else {
          Student.create({ name: name, identityCard: identityCard }).exec(
            function(err) {
              if (err) {
                res.send(500, { error: "Database Error" });
              }

              res.redirect("/student/list");
            }
          );
        }
      }
    } catch (error) {
      res.status(500).end(error.message);
    }
  },
  delete: function(req, res) {
    try {
      Student.destroy({ id: req.params.id }).exec(function(err) {
        if (err) {
          res.send(500, { error: "Database Error" });
        }

        res.redirect("/student/list");
      });
    } catch (error) {
      res.status(500).end(error.message);
    }
  },
  edit: function(req, res) {
    try {
      Student.findOne({ id: req.params.id }).exec(function(err, student) {
        if (err) {
          res.send(500, { error: "Database Error" });
        }

        res.view("edit", { student: student });
      });
    } catch (error) {
      res.status(500).end(error.message);
    }
  },
  update: function(req, res) {
    try {
      var name = req.body.name;
      var identityCard = req.body.identityCard;
      if (!name || !identityCard) {
        res
          .status(201)
          .json({ message: "Vui lòng điền đầy đủ thông tin!", success: false });
      } else {
        Student.update(
          { id: req.params.id },
          { name: name, identityCard: identityCard }
        ).exec(function(err) {
          if (err) {
            res.send(500, { error: "Database Error" });
          }

          res.redirect("/student/list");
        });
      }
    } catch (error) {
      res.status(500).end(error.message);
    }
  }
};
