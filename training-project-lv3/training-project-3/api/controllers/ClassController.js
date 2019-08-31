/**
 * ClassController
 *
 * @description :: Server-side logic for managing Classes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  list: function(req, res) {
    try {
      if(req.body){
        Class.find({name: {$regex: new RegExp(req.body.search)}}).exec(function(err, classes) {
          if (err) {
            res.send(501, { error: "Database Error" });
          }
          res.view("listClass", { classes: classes });
        });
      }
      else {
        Class.find({}).exec(function(err, classes) {
          if (err) {
            res.send(500, { error: "Database Error" });
          }
          res.view("listClass", { classes: classes });
        });
      }
     
    } catch (error) {
      res.status(500).end(error.message);
    }
  },
  add: function(req, res) {
    try {
      res.view("addClass");
    } catch (error) {
      res.status(500).end(error.message);
    }
  },
  create: async function(req, res) {
    try {
      var name = req.body.name;
      var group = req.body.group;

      if (!name || !group) {
        res
          .status(201)
          .json({ message: "Vui lòng điền đầy đủ thông tin!", success: false });
      } else {
        const checkClass = await Class.findOne({
          name: name
        });
        if (checkClass) {
          res.status(201).json({ message: "Lớp đã tồn tại!", success: false });
        } else {
          Class.create({ name: name, group: group }).exec(function(err) {
            if (err) {
              res.send(500, { error: "Database Error" });
            }

            res.redirect("/class/list");
          });
        }
      }
    } catch (error) {
      res.status(500).end(error.message);
    }
  },
  delete: function(req, res) {
    try {
      Class.destroy({ id: req.params.id }).exec(function(err) {
        if (err) {
          res.send(500, { error: "Database Error" });
        }

        res.redirect("/class/list");
      });
    } catch (error) {
      res.status(500).end(error.message);
    }
  },
  edit: function(req, res) {
    try {
      Class.findOne({ id: req.params.id }).exec(function(err, classes) {
        if (err) {
          res.send(500, { error: "Database Error" });
        }

        res.view("editClass", { classes: classes });
      });
    } catch (error) {
      res.status(500).end(error.message);
    }
  },
  update: function(req, res) {
    try {
      var name = req.body.name;
      var group = req.body.group;
      if (!name || !group) {
        res
          .status(201)
          .json({ message: "Vui lòng điền đầy đủ thông tin!", success: false });
      } else {
        Class.update({ id: req.params.id }, { name: name, group: group }).exec(
          function(err) {
            if (err) {
              res.send(500, { error: "Database Error" });
            }

            res.redirect("/class/list");
          }
        );
      }
    } catch (error) {
      res.status(500).end(error.message);
    }
  }
};
