$(document).ready(() => {
    const studentInfo = document.getElementsByClassName("addForm");
    $("#btn-add").click(e => {
      e.preventDefault();
      $.ajax({
        url: "http://localhost:1337/student/add",
        type: "POST",
        data: {
            name : studentInfo[0].value,
            identityCard : studentInfo[1].value,
            province : studentInfo[2].value,
            birth : studentInfo[3].value
            
        },
        success: data => {
            console.log(data)
          if (data.success) {
            swal("Add Success!").then(() => {
              window.location.href = "http://localhost:1337/student/list";
            });
          }
        },
        error: error => { 
            console.log("!")
          const mess = (document.getElementById("message-add").innerText =
            error.responseText);
        }
      });
    });
  });
  