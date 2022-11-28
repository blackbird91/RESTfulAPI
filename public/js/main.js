import { $, $$ } from "/js/selectors.js";
import { HTML } from "/js/item-template.js";
import { user } from "/js/proton.js";
import { url } from "/js/proton.js";
import { makeChart } from "/js/chart.js";


let isEditing = false;
let postType;
let pollOptions = [];

let fetchURL = url + "/items";

$("#add").addEventListener("click", (event) => {
  $("#post-item-container").style.display = "flex";
  $("#close").style.display = "block";
  $("body").style.overflow = "hidden";
});

$("#close").addEventListener("click", (event) => {
  $("#post-item-container").style.display = "none";
  $("body").style.overflow = "";
});

$("#add_option").addEventListener("click", (event) => {
  event.preventDefault();
  if ($$(".voteInput").length < 9) {
    $(".options").innerHTML +=
      '<input class="voteInput" type="text" required />';
    $("#remove_option").style = "display: inline-block !important";
  } else {
    alert("Maximum number of options is 9.");
  }
});

$("#remove_option").addEventListener("click", (event) => {
  event.preventDefault();
  if ($$(".voteInput").length === 3) {
    $(".voteInput:last-of-type").remove();
    event.target.style = "display: none !important";
  }
  if ($$(".voteInput").length > 2) {
    $(".voteInput:last-of-type").remove();
  }
});

const voteBTN = () => {
  $$(".vote-btn").forEach((el) => {
    el.addEventListener("click", (e) => {
      let obj = {};
      const arr = e.target.id.split("-");
      const num = arr.at(-1);
      obj.id = num;
      obj.user = user;
      if ($('input[name="post-' + num + '-options"]').checked) {
        obj.vote = $('input[name="post-' + num + '-options"]:checked').value;
      } else {
        alert("You have to select an option to vote.");
      }
      const stringifiedObj = JSON.stringify(obj);

      fetch(url + "/vote", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: stringifiedObj,
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log("Voted for option " + obj.id);
        });
    });
  });
};

$("#post-item").addEventListener("change", (event) => {
  postType = $('input[name="type"]:checked').value;
  pollOptions = [];
  $$(".voteInput").forEach((el, i) => {
    pollOptions.push(el.value);
  });
  if ($('input[name="type"]:checked').value === "poll") {
    $(".options").style = "";
    $("#add-remove-inputs").style = "display: block";
    $$(".voteInput").forEach((el, i) => {
      el.required = true;
      if (i === 0) {
        el.placeholder = "Yes";
      } else {
        el.placeholder = "No";
      }
    });
  } else {
    $(".options").style = "display: none";
    $("#add-remove-inputs").style = "";
    $$(".voteInput").forEach((el, i) => {
      el.required = false;
      el.placeholder = "";
    });
  }

  // let theFile = event.target.files[0];

  // if (checkFileProperties(theFile)) {
  //   handleUploadedFile(theFile);
  // }
});

// Add items to the data array in items.json
$("#post-item").addEventListener("submit", (event) => {
  event.preventDefault();
  // If the user is NOT editing, this will check to make sure that there is NOT an
  // already existing item in the items.json file
  if (!isEditing) {
    fetch(url + "/items")
      .then((response) => {
        return response.json();
      })
      .then((itemData) => {
        itemData.forEach((item) => {
          if ($("#title").value === item.title) {
            return new Error("Item already exists!");
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });

    // get the number of options added and push 0 for each of them to the votes array
    let votes = [];
    const voteInputsNr = $$(".voteInput").length;
    for (let i = 0; i < voteInputsNr; i++) {
      votes.push(0);
    }
    const formData = new FormData();


    formData.append("user", user);
    formData.append("title", $("#title").value);
    formData.append("image", $("#image").files[0]);
    formData.append("description", $("#description").value);
    (postType === "poll" ? pollOptions : ["Yes", "No"]).forEach((option) =>
      formData.append("options[]", option)
    );
    formData.append("tags", "tag1, tag5");
    formData.append("type", $('input[name="type"]:checked').value);
    (votes || []).forEach((option) =>
      formData.append("votes[]", parseInt(option))
    );

    // Sends post request to /post with all input information
    fetch(url + "/post", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        return response.json();
      })
      .then((returnedData) => {
        if (returnedData.status === 200) {
          // Gets and displays all items in the items.json file (including the new one just made)
          getItems();

          // Hides the form to add an item
          $("#post-item-container").style.display = "none";
          $("#close").style.display = "none";
          $("body").style.overflow = "";
        }
      });
  }
});

// // function to get all items from items.json file
const getItems = () => {
  // Fetches all data from items.json
  fetch(fetchURL)
    .then((response) => {
      return response.json();
    })
    .then((data) => {

      //Takes data from files and calls the HTML template to display the data
      $("#items").innerHTML = "";
      data.forEach((item) => {
        const html = new HTML();
        $("#items").innerHTML += html.insertHTML(item);
        makeChart(data);
        voteBTN();

        // EDIT FUNCTIONALITY
        $$(".edit").forEach((element) => {
          element.addEventListener("click", (event) => {
            isEditing = true;
            $("#post-item").style.display = "block";
            // get the id (title) of the clicked item
            element.id = event.target.id;
            editItems(element.id);
          });
        });
        $$(".delete").forEach((element) => {
          element.addEventListener("click", (event) => {
            // get the id (title) of the clicked item
            const arr = event.target.id.split("-");
            const id = arr.at(-1);
            deleteItem(id);
          });
        });
      });
    });
};

getItems();

const vote = () => {
  $$("#voting input").forEach((element) => {
    element.addEventListener("click", (event) => {
      console.log(event.target);
    });
  });
};

vote();

const deleteItem = (id) => {
  // Fetches all data from items.json
  const promptString = prompt(
    "Are you sure you want to delete this post?",
    "YES"
  );
  if (promptString != null && promptString === "YES") {
    let deleteID = JSON.stringify({ id: id });
    fetch(url + "/delete", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: deleteID,
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.status === 200) {
          getItems();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
  }
};

// HANDLING IMAGE UPLOAD

// function checkFileProperties(theFile) {
//   if (
//     theFile &&
//     theFile.type !== "image/png" &&
//     theFile.type !== "image/jpeg" &&
//     theFile.type !== "image/gif" &&
//     theFile.type !== "image/webp" &&
//     theFile.type !== "image/svg"
//   ) {
//     console.log("File type mismatch");
//     return false;
//   }

//   if (theFile.size > 500000) {
//     console.log("File too large");
//     return false;
//   }

//   return true;
// }

// function handleUploadedFile(file) {
//   $("#image-label").innerHTML = "";
//   const fileName = file.name;
//   var img = document.createElement("img");
//   img.setAttribute("id", "theImageTag");
//   img.file = file;
//   $("#image-label").appendChild(img);

//   var reader = new FileReader();
//   reader.onload = (function (aImg) {
//     return function (e) {
//       aImg.src = e.target.result;
//       $("#post-item").add;
//     };
//   })(img);
//   reader.readAsDataURL(file);
// }
