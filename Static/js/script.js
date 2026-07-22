// console.log("SCRIPT FILE LOADED");

const token = localStorage.getItem("token");

if (!token) {

    window.location.href = "/login";

}
const form = document.getElementById("predictionForm");

form.addEventListener("submit", function (event) {

    event.preventDefault();

    const age = parseInt(document.getElementById("age").value);
    const restingBP = parseFloat(document.getElementById("resting_bp").value);
    const cholesterol = parseFloat(document.getElementById("cholesterol").value);
    const fastingBS = parseInt(document.getElementById("fasting_bs").value);
    const maxHR = parseFloat(document.getElementById("max_hr").value);
    const oldpeak = parseFloat(document.getElementById("oldpeak").value);

    const sex = document.getElementById("sex").value;
    const chestPain = document.getElementById("chest_pain_type").value;
    const restingECG = document.getElementById("resting_ecg").value;
    const exerciseAngina = document.getElementById("exercise_angina").value;
    const stSlope = document.getElementById("st_slope").value;

    console.log(age);
    console.log(restingBP);
    console.log(cholesterol);
    console.log(fastingBS);
    console.log(maxHR);
    console.log(oldpeak);

    console.log(sex);
    console.log(chestPain);
    console.log(restingECG);
    console.log(exerciseAngina);
    console.log(stSlope);
    // Sex
    const Sex_M = Number(sex);

    // Chest Pain Type
    const ChestPainType_ATA = (chestPain === "1") ? 1 : 0;
    const ChestPainType_NAP = (chestPain === "2") ? 1 : 0;
    const ChestPainType_TA = (chestPain === "0") ? 1 : 0;

    // Resting ECG
    const RestingECG_Normal = (restingECG === "0") ? 1 : 0;
    const RestingECG_ST = (restingECG === "1") ? 1 : 0;

    // Exercise Angina
    const ExerciseAngina_Y = Number(exerciseAngina);

    // ST Slope
    const ST_Slope_Flat = (stSlope === "1") ? 1 : 0;
    const ST_Slope_Up = (stSlope === "0") ? 1 : 0;

    const data = {

        Age: age,
        RestingBP: restingBP,
        Cholesterol: cholesterol,
        FastingBS: fastingBS,
        MaxHR: maxHR,
        Oldpeak: oldpeak,

        Sex_M: Sex_M,

        ChestPainType_ATA: ChestPainType_ATA,
        ChestPainType_NAP: ChestPainType_NAP,
        ChestPainType_TA: ChestPainType_TA,

        RestingECG_Normal: RestingECG_Normal,
        RestingECG_ST: RestingECG_ST,

        ExerciseAngina_Y: ExerciseAngina_Y,

        ST_Slope_Flat: ST_Slope_Flat,
        ST_Slope_Up: ST_Slope_Up

    };

    console.log(data);

    document.getElementById("loading").style.display = "block";
    document.getElementById("result").innerHTML = "";

    const token = localStorage.getItem("token");

    fetch("/predict", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify(data)
    })
        .then(response => {

            if (!response.ok) {
                throw new Error("Prediction Failed");
            }

            return response.json();
        })
        .then(result => {

            document.getElementById("loading").style.display = "none";

            console.log("STEP 1");

            console.log(result);

            const resultDiv = document.getElementById("result");

            console.log(resultDiv);


            // Result card

                resultDiv.innerHTML = `

               <!-- 🔴 1. RESULT BOX -->
               <div class="${result.prediction === 1 ? 'danger-card' : 'safe-card'}">
                    <h2>
                        ${result.prediction === 1 ? "❤️ High Risk" : "✅ Low Risk"}
                    </h2>

                    <p><strong>
                    ${result.confidence > 70 
                        ? "⚠️ High probability detected! Immediate attention required."
                        : result.confidence > 40 
                        ? "⚡ Moderate risk. Stay cautious."
                        : "✅ You are in a safe zone. Maintain lifestyle."
                    }
                   </strong></p>

                    <h4>Risk Meter</h4>

                    <div class="progress-container">

                        <div class="progress-track">
                            <div class="progress-bar" 
                                style=
                                    "width:${result.confidence}%;
                                    background:${result.prediction === 1 ? '#e53935' : '#43a047'};
                                ">
                            </div>
                        </div>

                        <div class="progress-text">
                            ${result.confidence}%
                        </div>

                    </div>
                </div>


                <!-- 📊 2. GRAPH BOX -->
                <div class="card">
                    <h2 style="
                        display:flex;
                        justify-content:center;
                        align-items:center;
                        gap:8px;
                        font-weight:600;
                    ">
                        Risk Breakdown Analysis

                        <span style="
                            width:14px;
                            height:14px;
                            border:2px solid #4a90e2;
                            border-radius:50%;
                            position:relative;
                            display:inline-block;
                        ">
                            <span style="
                                width:2px;
                                height:7px;
                                background:#4a90e2;
                                position:absolute;
                                top:3px;
                                left:50%;
                                transform:translateX(-50%);
                                border-radius:1px;
                            "></span>
                        </span>
                    </h2>

                    <canvas id="featureChart"></canvas>
                </div>


                <!-- 🧾 3. SUMMARY BOX -->
                <div class="card">
                    <h2>🧾 Patient Summary</h2>

                    <p>👤 Age: ${age} Years</p>
                    <p>🚹 Gender: ${Sex_M == 0 ? "Male" : "Female"}</p>
                    <p>🩺  BP: ${restingBP} mmHg</p>
                    <p>🧬  Cholesterol: ${cholesterol} mg/dL</p>
                    <p>💓  Max HR: ${maxHR} bpm</p>
                    <p>📈 Oldpeak: ${oldpeak}</p>
                </div>


                <!-- 💊 4. ADVICE BOX -->
                <div class="card">
                    <h2>➕ Medical Advice</h2>

                    <ul>
                        ${
                            result.prediction === 1
                        ? `
                            <li>Consult a Cardiologist</li>
                            <li>Monitor BP regularly</li>
                            <li>Healthy diet</li>
                            <li>Exercise daily</li>
                          `
                        : `
                            <li>Continue healthy lifestyle</li>
                            <li>Regular exercise</li>
                            <li>Balanced diet</li>
                            <li>Routine checkup</li>
                          `
                    }
                </ul>

                <button id="downloadPDF" class="download-btn">
                    📄 Download Report
                </button>
            </div>

            `;

            const { jsPDF } = window.jspdf;

            document.getElementById("downloadPDF").addEventListener("click", () => {
            const doc = new jsPDF();

            const today = new Date();

            doc.setFontSize(10);
            doc.setTextColor(100);

            doc.text("Date : " + today.toLocaleDateString(),20,12);
            doc.text("Time : " + today.toLocaleTimeString(),150,12);

            // Logo Space
            doc.setDrawColor(170);
            doc.roundedRect(20,18,22,22,2,2);

            // If you later add logo image
           // doc.addImage(imgData,"PNG",21,19,20,20);

            doc.setFont("helvetica","bold");
            doc.setTextColor(0,70,140);
            doc.setFontSize(22);
            doc.text("HEART DISEASE REPORT",105,28,{align:"center"});
            doc.setFontSize(12);
            doc.text("AI Powered Health Screening System",105,36,{align:"center"});
            doc.setDrawColor(0,70,140);
            doc.setLineWidth(0.8);
            doc.line(20,43,190,43);

            doc.setFont("helvetica","bold");
            doc.setFontSize(15);
            doc.setTextColor(0,70,140);

            doc.text("PATIENT DETAILS",20,55);

            doc.setDrawColor(180);
            doc.line(20,58,190,58);

            doc.setFont("helvetica","normal");
            doc.setFontSize(12);
            doc.setTextColor(40);

            // Left
            doc.text("Name : __________",20,70);
            // doc.line(38,68,95,68);

            doc.text("Age : " + age + " Years",20,82);

            // Right
            doc.text("Gender : " + (Sex_M==0?"Male":"Female"),120,70);

            doc.text("Blood Group : __________",120,82);

            doc.setFont("helvetica","bold");
            doc.setTextColor(0,70,140);
            doc.setFontSize(15);

            doc.text("SUMMARY",20,100);

            doc.line(20,103,190,103);

            doc.setFont("helvetica","normal");
            doc.setTextColor(40);
            doc.setFontSize(12);

            doc.text("Blood Pressure : " + restingBP + " mmHg",20,115);

            doc.text("Cholesterol : " + cholesterol + " mg/dL",20,127);

            doc.text("Maximum Heart Rate : " + maxHR + " bpm",20,139);

            doc.text("Old Peak : " + oldpeak,20,151);

            
            doc.setFont("helvetica","bold");
            doc.setFontSize(15);
            doc.setTextColor(0,70,140);

            doc.text("PREDICTION RESULT",20,170);

            doc.line(20,173,190,173);

            doc.setFont("helvetica","normal");
            doc.setFontSize(12);
            doc.setTextColor(40);

            doc.text("Result :",20,186);

            doc.setFont("helvetica","bold");

            if(result.prediction==1){
                // doc.setTextColor(210,35,42);
                doc.setTextColor(40,40,40);
                doc.setTextColor(0,0,0);
                doc.text(result.result,60,186);

                // doc.setTextColor(210,35,42);
                doc.text("Statement : High Risk of Heart Disease",20,198);
            }else{

                // doc.setTextColor(0,150,80);
                doc.setTextColor(40,40,40);
                doc.setTextColor(0,0,0);
                doc.text(result.result,60,186);

                // doc.setTextColor(0,150,80);
                // doc.setTextColor(40,40,40);
                doc.text("Statement : Low Risk of Heart Disease",20,198);

            }

            doc.setFont("helvetica","normal");
            doc.setTextColor(40);

            doc.text("Confidence : " + result.confidence + "%",20,210);

            doc.setFont("helvetica","bold");
            doc.setFontSize(15);
            doc.setTextColor(0,70,140);

            doc.text("MEDICAL ADVICE",20,230);
            doc.setDrawColor(180);
            doc.line(20,235,190,235);
            // doc.line(20,228,190,228);

            doc.setFont("helvetica","normal");
            doc.setTextColor(40);

            let y = 240;

            if(result.prediction==1){
                doc.text("• Consult a Cardiologist",20,y);
                y+=10;
                doc.text("• Monitor Blood Pressure regularly",20,y);
                y+=10;
                doc.text("• follow a healthy low fat diet",20,y);
                y += 10;
                doc.text("• Exercise regularly and avoid smoking.",20,y);
            }else{
                doc.text("• Continue healthy lifestyle",20,y);
                y+=10;
                doc.text("• Maintain a balanced diet.",20,y);
                y+=10;
                doc.text("• Exercise for at least 30 minutes daily.",20,y);
                y+=10;
                doc.text("• Schedule routine health check-ups.",20,y);

            }

            doc.setDrawColor(200);
            doc.line(20,272,190,272);

            // THANK YOU (Above Footer Message)
            doc.setFont("helvetica","bold");
            doc.setFontSize(14);
            doc.setTextColor(0,70,140);
            doc.text("THANK YOU",105,279,{align:"center"});

            // doc.line(20,265,190,265);

            // doc.line(20,285,190,285);

            doc.setFont("helvetica","normal");        

            doc.setFontSize(9);
            doc.setTextColor(110);


            doc.text("This report is generated by an AI model and is for informational purposes only.",105,284,{align : "center"});
            doc.text("It does not replace professional medical advice.",105,289,{align : "center"});

            doc.save("Heart_Disease_Report.pdf");
            });


            drawFeatureChart(
                age,
                restingBP,
                cholesterol,
                maxHR,
                oldpeak
            );

            setTimeout(() => {
                const bar = document.querySelector(".progress-bar");
                if (bar) {
                    bar.style.width = result.confidence + "%";
                }
            }, 100);
          

            resultDiv.style.display = "block";



            console.log(age);
            console.log(restingBP);
            console.log(cholesterol);
            console.log(maxHR);
            console.log(oldpeak);

            // drawFeatureChart(
            //     age,
            //     restingBP,
            //     cholesterol,
            //     maxHR,
            //     oldpeak
            // );


        })
        .catch(error => {

            document.getElementById("loading").style.display = "none";

            document.getElementById("result").innerHTML = `
        <div class="danger-card">
            <h2>❌ Error</h2>
            <p>${error.message}</p>
        </div>
    `;

        });


});


let featureChart = null;

function drawFeatureChart(age, bp, chol, hr, oldpeak) {

    const ctx = document.getElementById("featureChart");

    if (featureChart) {
        featureChart.destroy();
    }

    let features = [

        {
            name: "Blood Pressure",
            score: Math.min((bp / 200) * 100, 100),
            color: "#d9534f",
            value: bp + " mmHg"
        },

        {
            name: "Cholesterol",
            score: Math.min((chol / 400) * 100, 100),
            color: "#602bdc",
            value: chol + " mg/dL"
        },

        {
            name: "Oldpeak",
            score: Math.min((oldpeak / 6) * 100, 100),
            color: "#ff9800",
            value: oldpeak
        },

        {
            name: "Maximum HR",
            score: Math.min((hr / 200) * 100, 100),
            color: "#4caf50",
            value: hr + " bpm"
        },

        {
            name: "Age",
            score: Math.min((age / 100) * 100, 100),
            color: "#2196f3",
            value: age + " Years"
        }

    ];

    // Highest contribution first
    features.sort((a, b) => b.score - a.score);

    featureChart = new Chart(ctx, {

        type: "bar",

        data: {

            labels: features.map(f => f.name),

            datasets: [{
                data: features.map(f => f.score),
                backgroundColor: features.map(f => f.color),
                borderRadius: 10
            }]
        },

        options: {

            indexAxis: "y",

            responsive: true,

            plugins: {

                legend: {
                    display: false
                },

                tooltip: {

                    callbacks: {

                        label: function (context) {

                            return features[context.dataIndex].value;

                        }

                    }

                },

                datalabels: {

                    anchor: "end",

                    align: "right",

                    color: "#222",

                    font: {
                        weight: "bold"
                    },

                    formatter: function (value) {
                        return value.toFixed(0) + "%";
                    }

                }

            },

            scales: {

                x: {

                    max: 100,

                    beginAtZero: true

                }

            },

            animation: {

                duration: 1800

            }

        },

        plugins: [ChartDataLabels]

    });

}

const animateText = (finalValue) => {
    const text = document.querySelector(".progress-text");
    let start = 0;

    const interval = setInterval(() => {
        if (start >= finalValue) {
            clearInterval(interval);
        } else {
            start++;
            text.innerText = start + "%";
        }
    }, 15);
};
animateText(result.confidence);

function logout() {

    localStorage.removeItem("token");

    alert("Logged Out Successfully!");

    window.location.href = "/login";

}