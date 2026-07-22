// ================================
// HeartCare AI Authentication
// ================================

// =====================
// Message Box
// =====================

function showMessage(message, type){

    const box = document.getElementById("messageBox");

    box.innerHTML = message;

    box.className = "message-box";
    box.style.display="block";

    if(type==="success"){

        box.classList.add("message-success");

    }

    else{

        box.classList.add("message-error");

    }

    setTimeout(()=>{

        box.style.display="block";

    },100);

    setTimeout(()=>{

        box.style.display="none";

    },3000);

}



// =====================
// Password Toggle
// =====================

function togglePassword(id, btn){

    const input = document.getElementById(id);

    if(input.type==="password"){

        input.type="text";

        btn.innerHTML="Hide";

    }

    else{

        input.type="password";

        btn.innerHTML="Show";

    }

}

// Sections
const signupSection = document.getElementById("signupSection");
const loginSection = document.getElementById("loginSection");

// Tabs
const signupTab = document.getElementById("signupTab");
const loginTab = document.getElementById("loginTab");


// -------------------------------
// Show Signup Form
// -------------------------------
function showSignup() {

    signupSection.classList.remove("hidden");
    loginSection.classList.add("hidden");

    signupTab.classList.add("active");
    loginTab.classList.remove("active");

}


// -------------------------------
// Show Login Form
// -------------------------------
function showLogin() {

    loginSection.classList.remove("hidden");
    signupSection.classList.add("hidden");

    loginTab.classList.add("active");
    signupTab.classList.remove("active");

}



// ====================================================
// SIGNUP
// ====================================================

document.getElementById("signupForm").addEventListener("submit", async function(e){

    e.preventDefault();

    const btn = this.querySelector("button");

    btn.disabled = true;
    btn.classList.add("loading");
    btn.innerText = "Creating Account...";

    const response = await fetch("/auth/signup",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            name:document.getElementById("name").value,

            email:document.getElementById("signupEmail").value,

            phone:document.getElementById("phone").value,

            password:document.getElementById("signupPassword").value

        })

    });

    const data = await response.json();

    btn.disabled = false;
    btn.classList.remove("loading");
    btn.innerText = "Create Account";

    if(response.ok){

        showMessage("Account Created Successfully!  Please login.", "success");

        document.getElementById("signupForm").reset();

        // Automatically switch to Login
        setTimeout(()=>{

            showLogin();

        },1500);
       

    }

    else{

        showMessage(data.detail, "error");

    }

});



// ====================================================
// LOGIN
// ====================================================

document.getElementById("loginForm").addEventListener("submit", async function(e){

    e.preventDefault();

    const btn = this.querySelector("button");

    btn.disabled = true;
    btn.classList.add("loading");
    btn.innerText = "Logging In...";

    const response = await fetch("/auth/login",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            email:document.getElementById("loginEmail").value,

            password:document.getElementById("loginPassword").value

        })

    });

    const data = await response.json();

    btn.disabled = false;
    btn.classList.remove("loading");
    btn.innerText = "Login";

    if(response.ok){

        // Save JWT Token
        localStorage.setItem("token",data.access_token);

        // Redirect to Home
        window.location.href="/home";

    }

    else{

        alert(data.detail);

    }

});




// Open Signup by Default
showSignup();

window.addEventListener("load", () => {
    document.querySelectorAll("input").forEach(input => {
        input.value = "";
    });
});