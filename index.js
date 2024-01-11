// Selectors
const themeToggleBtn = document.querySelector(".theme-toggle");
const checkBox = document.querySelector("#darkmode-toggle");


// Checking theme
const theme = localStorage.getItem("theme");
if (theme) {
    document.body.classList.add(theme);
    checkBox.checked = true;
}


// Handling theme toggler
themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark-mode");
    } else {
        localStorage.removeItem("theme");
    };
});
let baseURL = "https://tarmeezacademy.com/api/v1";
setupUI()
function setupUI() {
    const token = localStorage.getItem("token");
    const loginDiv = document.getElementById("logged-in-div");
    const logoutDiv = document.getElementById("logout-div");
    const addBtn = document.querySelector("#add-btn");
    if (token == null) {
        loginDiv.style.setProperty("display", "flex", "important");
        logoutDiv.style.setProperty("display", "none", "important");
        if (addBtn != null) {
            addBtn.style.setProperty("display", "none", "important");
        }
    } else {
        loginDiv.style.setProperty("display", "none", "important");
        logoutDiv.style.setProperty("display", "flex", "important");
        if (addBtn != null) {
        addBtn.style.setProperty("display", "block", "important");
        }
        const user = getCurrentUser();
        document.getElementById("nav-username").innerHTML = user.username;
        document.getElementById("nav-user-image").src = user.profile_image
    }
};

function addBtnClicked() {
    document.getElementById("post-modal-submit-btn").innerHTML = "Create"
    document.getElementById("post-id-input").value = ""
    document.getElementById("post-modal-title").innerHTML = "Create A New Post"
    document.getElementById("post-title-input").value = ""
    document.getElementById("post-body-input").value = ""
    let postModal = new bootstrap.Modal(document.getElementById("create-post-modal"), {})
    postModal.toggle()
};

function loginBtnClicked() {
    toggleLoader(true)
    let baseURL = "https://tarmeezacademy.com/api/v1";
    const username =document.getElementById("username-input").value;
    const password =document.getElementById("password-input").value;
    console.log(username, password);
    const params = {
        "username": username,
        "password": password
    }
    const url = `${baseURL}/login`;
    let response = fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    }).then((response) => {
        console.log(response)
        let user = response.json();
        return user;
    }).then((user) => {
        console.log(user)
        toggleLoader(false)
        window.localStorage.setItem("token", user.token);
        window.localStorage.setItem("user", JSON.stringify(user.user));
        const modal = document.getElementById("login-modal");
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
        showAlert("Logged In Successfully", "success");
        setTimeout(() => {
            document.querySelector(".alert-dismissible").remove();
        }, 5000)
        setupUI();
    }).catch((error) => {
        console.log(error)
        toggleLoader(false)
    })

}


async function registerBtnClicked() {
    let formData;
    const closeBtn = document.getElementById("close-registration");
    const name =document.getElementById("register-name-input").value;
    const username =document.getElementById("register-username-input").value;
    const password =document.getElementById("register-password-input").value;
    const image = document.getElementById("register-image-input").files[0];
    console.log(username, password, name, image);
    formData = new FormData();
    formData.append("username", username)
    formData.append("password", password)
    formData.append("name", name)
    if (image) {
        formData.append("image", image)
    }
    
    try {
        let response = await fetch(`${baseURL}/register`, {
            method: "POST",
            body: formData,
            headers: {
                "Accept": "application/json"
            }
        })

        let user = await response.json();
        console.log(user);

        if (!user.errors) {
            window.localStorage.setItem("token", user.token);
            window.localStorage.setItem("user", JSON.stringify(user.user));
            closeBtn.click();
            showAlert("New User Registered Successfully, Welcome!", "success");
            setTimeout(() => {
                document.querySelector(".alert-dismissible").remove();
            }, 5000)
          } else {
            // let values = [];

            // for (const key in user.errors) {
            //     if (Array.isArray(user.errors[key])) {
            //         for (const value of user.errors[key]) {
            //             values.push(value);
            //         }
            //     }
            // }
            // console.log(values)
            let errors = Object.values(user.errors).map(val => val).join(" ");
            console.log(errors)

            throw new Error(errors);
          }
    } catch (err) {
        showAlert(err.message, "danger");
        setTimeout(() => {
            document.querySelector(".alert-dismissible").remove();
        }, 5000)
    }
    setupUI();
}


function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    showAlert("Logged Out Successfully", "success")
    setTimeout(() => {
        document.querySelector(".alert-dismissible").remove();
    }, 5000)
    setupUI()
};

function showAlert (message1, type) {
    const alertPlaceholder = document.getElementById('success-alert');
    const appendAlert = (message, type) => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" style="position: fixed; z-index: 99999; bottom: 20px;" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" id="close-alert" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('')

    alertPlaceholder.append(wrapper);
};

        appendAlert(message1, type);

};

function getCurrentUser() {
    let user = null;
    const storageUser = localStorage.getItem("user");
    if (storageUser != null) {
        user = JSON.parse(storageUser)
    }
    return user;
};

function editPostBtnClicked(postObject) {
    let post = JSON.parse(decodeURIComponent(postObject))
    console.log(post)
    document.getElementById("post-modal-submit-btn").innerHTML = "Update";
    document.getElementById("post-id-input").value = post.id;
    document.getElementById("post-modal-title").innerHTML = "Edit Post";
    document.getElementById("post-title-input").value = post.title;
    document.getElementById("post-body-input").value = post.body;
    let postModal = new bootstrap.Modal(document.getElementById("create-post-modal"), {});
    postModal.toggle()
}


function deletePostBtnClicked(postObject) {
    let post = JSON.parse(decodeURIComponent(postObject))
    console.log(post)
    document.getElementById("delete-post-id-input").value = post.id;
    console.log(post.id)
    let postModal = new bootstrap.Modal(document.getElementById("delete-post-modal"), {});
    postModal.toggle()
}


function userClicked(userId) {
    window.location = `profile.html?userId=${userId}`
}
  
  function postClicked(postId) {
    window.location = `postDetails.html?postId=${postId}`;
}

async function confirmPostDelete() {
    const currentUrl = window.location.href;
    let token = localStorage.getItem("token");
    let postId = document.getElementById("delete-post-id-input").value;
    let baseURL = "https://tarmeezacademy.com/api/v1";
    let url = `${baseURL}/posts/${postId}`;
    let response = await fetch(url, {
      method: "Delete",
      headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
      },
    })
    let user = await response.json();
    console.log(user)
    const modal = document.getElementById("delete-post-modal");
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
    showAlert("The Post Has Been Deleted Successfully", "success");
    setTimeout(() => {
        document.querySelector(".alert-dismissible").remove();
    }, 5000)
    if (currentUrl.includes("index.html")) {
        document.querySelector("#posts").innerHTML = "";
    } else if (currentUrl.includes("profile.html")) {
        document.querySelector("#user-posts").innerHTML = "";
    }
    
    getPosts();
}


async function createNewPostClicked() {
    const currentUrl = window.location.href;
    let formData;
    let postId = document.getElementById("post-id-input").value;
    let isCreate = postId == null || postId == "";

    let title = document.getElementById("post-title-input").value;
    let body = document.getElementById("post-body-input").value;
    let image = document.getElementById("post-image-input").files[0];

    let token = localStorage.getItem("token");

    formData = new FormData();
    formData.append('title', title);

    formData.append('body', body);

    if (image) {
        formData.append("image", image);
    }

    let url = ``;

    if (isCreate) {
        url = `${baseURL}/posts`;

    } else {
        url = `${baseURL}/posts/${postId}`;
        formData.append("_method", "put"); // for laravel and php
    }
    
    try {
        let response = await fetch(url, {
            method: "POST",
            body: formData,
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            }
        });
        let result = await response.json();

        if (result.errors) {
            let errors = Object.values(result.errors).map(val => val).join(" ");
            throw new Error(errors);
        } else {
            document.querySelector("#closed").click();
            if(isCreate) {
                showAlert("You've created a new post successfully.", "success");
            } else {
                showAlert("You've edited your post successfully", "success");
            }
            setTimeout(() => {
                document.querySelector(".alert-dismissible").remove();
            }, 5000)

            if (currentUrl.includes("index.html")) {
                document.querySelector("#posts").innerHTML = "";
            } else if (currentUrl.includes("profile.html")) {
                document.querySelector("#user-posts").innerHTML = "";
            }
            
            getPosts();
            
        }
    } catch (err) {
        showAlert(err.message, "danger");
        setTimeout(() => {
            document.querySelector(".alert-dismissible").remove();
        }, 5000);
    }
    
};

function profileClicked() {
    const user = getCurrentUser();
    const userId = user.id;
    window.location = `profile.html?userId=${userId}`;
};

function toggleLoader(show = true) {
    if (show) {
      document.getElementById("loader").style.visibility = "visible";
    } else {
      document.getElementById("loader").style.visibility = "hidden";
    }
};

// document.addEventListener("DOMContentLoaded", () => {
//     document.addEventListener("keydown", (event) => {
//         if (event.key === "Enter") {

//             console.log("true")
//             sendBtn.click();
//         }
//     });
// });