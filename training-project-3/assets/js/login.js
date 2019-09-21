$(document).ready(() => {
  const userInfo = document.getElementsByClassName("loginForm");
  $("#btn-login").click(e => {
    e.preventDefault();
    $.ajax({
      url: "http://localhost:1337/login",
      type: "POST",
      data: {
        username: userInfo[0].value,
        password: userInfo[1].value
      },
      success: data => {
        if (data.success) {
          localStorage.setItem("checkLogin",data.username);
          swal("Login Success!").then(() => {
            window.location.href = "http://localhost:1337/";
          });
        }
      },
      error: error => { 
        const mess = (document.getElementById("message-login").innerText =
          error.responseText);
      }
    });
  });
});
