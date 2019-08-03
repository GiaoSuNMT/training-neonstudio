window.onload = () => {
  $.ajax({
    url: `/list-infor`,
    type: "GET",
    success: data => {
      data.forEach(element => {
        $("#tbody").append(`
                    <tr>
                        <td>${element.id + 1}</td>
                        <td><input class='information' id="${
                          element.id
                        }-name" value='${element.name}' /></td>
                        <td><input class='information' id="${
                          element.id
                        }-phone" value='${element.phoneNumber}' /></td>
                        <td class='delete' id="${
                          element.id
                        }-delete"><button class="btn btn-danger">Xóa</button></td>
                    </tr>
                `);
      });

      //add
      const interns = data;
      document.getElementById("add-new").addEventListener("click", () => {
        // add new
        $("#tbody").append(`
                    <tr>
                    <td>${data.length + 1}</td>
                    <td><input class='information' id="${
                      data.length
                    }-name" /></td>
                    <td><input class='information' id="${
                      data.length
                    }-phone" /></td>
                    <td class='delete' id="${
                      data.length
                    }-delete"><button class="btn btn-danger">Xóa</button></td>
                    </tr>
                `);
        interns.push("");

        $.ajax({
          url: `/list/${data.length}`,
          type: "PUT",
          data: {
            type: "add_new"
          }
        });
      });

      //delete
      const buttonDeletes = document.getElementsByClassName("delete");
      Array.from(buttonDeletes).forEach(element => {
        element.addEventListener("click", () => {
          const deleteId = element.id;
          const internId = deleteId.split("-")[0];
          $.ajax({
            url: `/delete/${internId}`,
            type: "DELETE",
            success: data => {
              location.reload();
            },
            error: error => {
              console.log(error);
            }
          });
        });
      });

      //update
      const inputInfors = document.getElementsByClassName("information");
      Array.from(inputInfors).forEach(input => {
        input.addEventListener("input", () => {
          const inputId = input.id;
          const internId = inputId.split("-")[0];
          const infor = inputId.split("-")[1];

          $.ajax({
            url: `/list/${internId}`,
            type: "PUT",
            data: {
              type: "update_infor",
              value: input.value,
              infor: infor
            }
          });
        });
      });
    },
    error: error => {
      console.log(error);
    }
  });
};
