$(document).ready(() => {
  // const studentInfo = document.getElementsByClassName("deleteStudent");
  $(".btn-delete").click(e => {
    const sid = e.currentTarget.attributes.sid.nodeValue;
    e.preventDefault();
    swal({
      title: "Are you sure?",
      icon: "warning",
      buttons: true,
      dangerMode: true
    }).then(willDelete => {
      if (willDelete) {
        $.ajax({
          url: `/student/delete/${sid}`,
          type: "POST",
          success: data => {
            console.log(data);
            if (data==="Deleted") {
              swal("Delete Success!").then(() => {
                 window.location.href = "http://localhost:1337/student/list";
              });
            }
          },
          error: error => {
            console.log(error);
          }
        });
      } else {
        console.log("1");
      }
    });
  });
});
