const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "/login";
}



document.getElementById("guestButtons").style.display="none";
document.getElementById("userButtons").style.display="block";

document.getElementById("welcomeUser").innerHTML=
    "Welcome Back 👋";


function goPrediction(){

    window.location.href="/prediction";

}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
}