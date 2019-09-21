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
            return res.badRequest("Database Error");
          }
          return res.view("listClass", { classes: classes });
        });
      }
      else {
        Class.find({}).exec(function(err, classes) {
          if (err) {
            return res.badRequest("Database Error");
          }
          return res.view("listClass", { classes: classes });
        });
      }
     
    } catch (error) {
      return res.notFound(error.message);
    }
  },
  // add: function(req, res) {
  //   try {
  //     return res.view("addClass");
  //   } catch (error) {
  //     return res.notFound(error.message);
  //   }
  // },
  create: async function(req, res) {
    try {
      var name = req.body.name;
      var group = req.body.group;

      if (!name || !group) {
        return res.badRequest("Vui lòng điền đầy đủ thông tin!");
      } else {
        const checkClass = await Class.findOne({
          name: name
        });
        if (checkClass) {
          return res.badRequest("Lớp đã tồn tại!");
        } else {
          Class.create({ name: name, group: group }).exec(function(err) {
            if (err) {
              return res.badRequest("Database Error");
            }

            return res.redirect("/class/list");
          });
        }
      }
    } catch (error) {
      return res.notFound(error.message);
    }
  },
  delete: function(req, res) {
    try {
      Class.destroy({ id: req.params.id }).exec(function(err) {
        if (err) {
          return res.badRequest("Database Error");
        }

        return res.redirect("/class/list");
      });
    } catch (error) {
      return res.notFound(error.message);
    }
  },
  edit: function(req, res) {
    try {
      Class.findOne({ id: req.params.id }).exec(function(err, classes) {
        if (err) {
          return res.badRequest("Database Error");
        }

        return res.view("editClass", { classes: classes });
      });
    } catch (error) {
      return res.notFound(error.message);
    }
  },
  update: function(req, res) {
    try {
      var name = req.body.name;
      var group = req.body.group;

      if (!name || !group) {
        return res.badRequest("Vui lòng điền đầy đủ thông tin!");
      } else {
        Class.update({ id: req.params.id }, { name: name, group: group }).exec(
          function(err) {
            if (err) {
              return res.badRequest("Database Error");
            }

            res.redirect("/class/list");
          }
        );
      }
    } catch (error) {
      return res.notFound(error.message);
    }
  }
};
