
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Security
from utils.jwt_handler import verify_token

from sqlalchemy.orm import Session
from fastapi import Depends , HTTPException
from database.database import get_db
from database.database import engine
from database.models import User, Prediction

from fastapi import FastAPI, Request
from database.database import engine
from database.models import Base
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
import pandas as pd
import joblib
from fastapi.responses import HTMLResponse
from routes.auth import router as auth_router
from routes.history import router as history_router
from routes.profile import router as profile_router
from routes.dashboard import router as dashboard_router


app = FastAPI()

security = HTTPBearer()

app.include_router(auth_router)
app.include_router(history_router)
app.include_router(profile_router)
app.include_router(dashboard_router)

Base.metadata.create_all(bind=engine)


templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="Static"), name="static")

# Load files
model = joblib.load("model/KNN_heart.pkl")
scaler = joblib.load("model/scaler.pkl")
columns = joblib.load("model/columns.pkl")


class HeartData(BaseModel):
    Age: int
    RestingBP: float
    Cholesterol: float
    FastingBS: int
    MaxHR: float
    Oldpeak: float

    Sex_M: int

    ChestPainType_ATA: int
    ChestPainType_NAP: int
    ChestPainType_TA: int

    RestingECG_Normal: int
    RestingECG_ST: int

    ExerciseAngina_Y: int

    ST_Slope_Flat: int
    ST_Slope_Up: int



@app.get("/", response_class=HTMLResponse)
async def auth_page(request: Request):

    return templates.TemplateResponse(
        request=request , 
        name = "auth.html"
    )


@app.get("/home", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse(
        request = request,
        name = "home.html"
    )

@app.get("/prediction", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="index.html"
    )

@app.get("/dashboard", response_class=HTMLResponse)
async def dashboard(request: Request):

    return templates.TemplateResponse(
        request=request,
        name="dashboard.html"
    )


@app.post("/predict")

def predict(
    data: HeartData,
    credentials: HTTPAuthorizationCredentials = Security(security),
    db: Session = Depends(get_db)
        
):
    token = credentials.credentials

    print("JWT Token:", token)

    payload = verify_token(token)

    if payload is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    email = payload["sub"]
    user = db.query(User).filter(
        User.email == email
    ).first()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )


    input_data = pd.DataFrame([data.dict()])

    input_data = input_data[columns]

    input_scaled = scaler.transform(input_data)

    prediction = model.predict(input_scaled)[0]

    probability = model.predict_proba(input_scaled)[0]

    raw_confidence = max(probability) * 100

    if prediction == 0:
        confidence = min(round(raw_confidence), 35)
    else:
        confidence = min(round(raw_confidence), 85)

    new_prediction = Prediction(
        user_id=user.id,
        age=data.Age,
        resting_bp=data.RestingBP,
        cholesterol=data.Cholesterol,
        max_hr=data.MaxHR,
        prediction="Heart Disease Detected" if prediction == 1 else "No Heart Disease",
        probability=confidence
    )

    db.add(new_prediction)
    db.commit()

    return {
        "prediction": int(prediction),
        "confidence": confidence,
        "result": "Heart Disease Detected"
        if prediction == 1
        else 
        "No Heart Disease"
    }




@app.get("/history-page", response_class=HTMLResponse)
async def history_page(request: Request):

    return templates.TemplateResponse(
        request=request,
        name="history.html"
    )

@app.get("/profile-page", response_class=HTMLResponse)
async def profile_page(request: Request):

    return templates.TemplateResponse(
        request=request,
        name="profile.html"
    )
