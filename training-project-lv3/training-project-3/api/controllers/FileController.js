/**
 * FileController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  index: function(req, res) {
    const id = req.params.id;
    res.writeHead(200, { "content-type": "text/html" });
    res.end(
      '<div class="container">' +     
      `<form action="http://localhost:1337/file/upload/${id}" enctype="multipart/form-data" method="post">` +
        '<input type="text" name="title"><br>' +
        '<input type="file" name="avatar" multiple="multiple"><br>' +
        '<input type="submit" value="Upload">' +
        "</form>" +
        '</div>'
    );
  },
  upload: function(req, res) {
    req.file("avatar").upload({
      saveAs: req.params.id + '.jpg'
    },function(err, files) {

      if (err) return res.serverError(err);

      return res.json({
        message: files.length + " file(s) uploaded successfully!",
        files: files
      });
    });
  }
};
