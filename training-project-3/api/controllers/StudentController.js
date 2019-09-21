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
          name: { $regex: new RegExp(req.body.searchName) },
          identityCard: { $regex: new RegExp(req.body.searchIdentityCard) },
          birth: { $regex: new RegExp(req.body.searchBirth) },
          province: { $regex: new RegExp(req.body.searchProvince) }
        }).exec(function(err, student) {
          if (err) {
            return res.badRequest("Database Error");
          }
          return res.view("list", { student: student });
        });
      } else {
        Student.find({}).exec(function(err, student) {
          if (err) {
            return res.badRequest("Database Error");
          }
          return res.view("list", { student: student });
        });
      }
    } catch (error) {
      return res.notFound(error.message);
    }
  },
  add: function(req, res) {
    try {
      return res.view("add");
    } catch (error) {
      return res.notFound(error.message);
    }
  },
  create: async function(req, res) {
    try {
      var name = req.body.name;
      var identityCard = req.body.identityCard;
      var birth = req.body.birth;
      var province = req.body.province;

      if (!name || !identityCard || !birth) {
        return res.badRequest("Vui lòng điền đầy đủ thông tin!", {
          success: false
        });
      } else {
        const checkStudent = await Student.findOne({
          identityCard: identityCard
        });
        if (checkStudent) {
          return res.badRequest("Học sinh đã tồn tại!", { success: false });
        } else {
          Student.create({
            name: name,
            identityCard: identityCard,
            birth: birth,
            province: province
          }).exec(function(err) {
            if (err) {
              return res.badRequest("Database Error", { success: false });
            }
            const response = {
              message: "Added",
              success: true
            };
            
            return res.created(response);
          });
        }
      }
    } catch (error) {

      return res.notFound(error.message);
    }
  },
  delete: function(req, res) {
    try {
      Student.destroy({ id: req.params.id }).exec(function(err) {
        if (err) {
          return res.badRequest("Database Error",{success: false});
        }
        return res.ok("Deleted");
        // return res.redirect("/student/list");
      });
    } catch (error) {
      return res.notFound(error.message);
    }
  },
  edit: function(req, res) {
    try {
      Student.findOne({ id: req.params.id }).exec(function(err, student) {
        if (err) {
          return res.badRequest("Database Error");
        }

        return res.view("edit", { student: student });
      });
    } catch (error) {
      return res.notFound(error.message);
    }
  },
  update: function(req, res) {
    try {
      var name = req.body.name;
      var identityCard = req.body.identityCard;
      var birth = req.body.birth;
      var province = req.body.province;
      if (!name || !identityCard) {
        return res.badRequest("Vui lòng điền đầy đủ thông tin!");
      } else {
        Student.update(
          { id: req.params.id },
          {
            name: name,
            identityCard: identityCard,
            birth: birth,
            province: province
          }
        ).exec(function(err) {
          if (err) {
            return res.badRequest("Database Error");
          }

          return res.redirect("/student/list");
        });
      }
    } catch (error) {
      return res.notFound(error.message);
    }
  }
};
