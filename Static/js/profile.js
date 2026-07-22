const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "/login";
}

fetch("/profile", {

    method: "GET",

    headers: {
        "Authorization": "Bearer " + token
    }

})
.then(res => res.json())

.then(data => {

    document.getElementById("name").value = data.name;

    document.getElementById("email").value = data.email;

    document.getElementById("phone").value = data.phone;

});

function updateProfile() {

    fetch("/profile", {

        method: "PUT",

        headers: {

            "Content-Type": "application/json",

            "Authorization": "Bearer " + token

        },

        body: JSON.stringify({

            name: document.getElementById("name").value,

            phone: document.getElementById("phone").value

        })

    })

    .then(res => res.json())

    .then(data => {

        alert("✅ Profile Updated Successfully!");

    })

    .catch(err => {

        alert("❌ Update Failed!");

    });

}