const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "/login";
}

fetch("/history", {
    method: "GET",
    headers: {
        "Authorization": "Bearer " + token
    }
})
.then(response => response.json())
.then(data => {

    const tbody = document.getElementById("historyBody");
    tbody.innerHTML = "";

    if (data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="padding:40px;font-size:18px;">
                    No prediction history found.
                </td>
            </tr>
        `;
        return;
    }

    data.forEach(item => {

        const resultBadge =
            item.prediction === "Heart Disease Detected"
            ? `<span class="badge high-risk">High Risk</span>`
            : `<span class="badge low-risk">Low Risk</span>`;

        tbody.innerHTML += `
            <tr>

                <td>${new Date(item.created_at).toLocaleString()}</td>

                <td>${item.age}</td>

                <td>${item.resting_bp}</td>

                <td>${item.cholesterol}</td>

                <td>${item.max_hr}</td>

                <td>${resultBadge}</td>

                <td>
                    <div class="progress-box">

                        <div class="progress">
                            <span style="width:${item.probability}%"></span>
                        </div>

                        ${item.probability}%

                    </div>
                </td>

            </tr>
        `;

    });

})
.catch(error => {
    console.error(error);
});