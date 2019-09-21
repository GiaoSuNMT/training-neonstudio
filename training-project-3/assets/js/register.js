$(document).ready(() => {
  const userReg = document.getElementsByClassName("regForm");
  $("#btn-register").click(e => {
    e.preventDefault();
    $.ajax({
      url: "http://localhost:1337/register",
      type: "POST",
      data: {
        username: userReg[0].value,
        password: userReg[1].value,
        name: userReg[2].value,
        numberLogin: userReg[3].value
      },
      success: data => {
        console.log(userReg);
        console.log(data);
        if (data.success) {
          swal("Create New Account Success!").then(() => {
            window.location.href = "http://localhost:1337/login";
          });
        }
      },
      error: error => {
        console.log("1");
        console.log(error);
        const mess = (document.getElementById("message-register").innerText =
        error.responseText);
      }
    });
  });
});
