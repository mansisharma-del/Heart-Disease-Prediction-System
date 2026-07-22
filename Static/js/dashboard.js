const token = localStorage.getItem("token");

if(!token){
    window.location.href="/login";
}

fetch("/dashboard-data",{

    method:"GET",

    headers:{
        "Authorization":"Bearer "+token
    }

})
.then(res=>res.json())

.then(data=>{

    document.getElementById("welcome").innerHTML =
        `Welcome, ${data.name} 👋`;

    document.getElementById("total").innerText = data.total;

    document.getElementById("high").innerText = data.high;

    document.getElementById("low").innerText = data.low;

    document.getElementById("latest").innerText =
    data.latest ? new Date(data.latest).toLocaleString() : "No Predictions";

})

.catch(error=>{

    console.log(error);

});