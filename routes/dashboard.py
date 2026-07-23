from fastapi import APIRouter, Depends, Security, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from database.database import get_db
from database.models import User, Prediction
from utils.jwt_handler import verify_token

router = APIRouter(tags=["Dashboard"])

security = HTTPBearer()


@router.get("/dashboard-data")
def dashboard_data(
    credentials: HTTPAuthorizationCredentials = Security(security),
    db: Session = Depends(get_db)
):

    token = credentials.credentials

    payload = verify_token(token)

    if payload is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid Token"
        )

    user = db.query(User).filter(
        User.email == payload["sub"]
    ).first()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    predictions = db.query(Prediction).filter(
        Prediction.user_id == user.id
    ).all()

    total = len(predictions)

    high = len([
        p for p in predictions
        if p.prediction == "Heart Disease Detected"
    ])

    low = total - high

    latest = None

    if total > 0:
        latest = predictions[-1].created_at

    return {

        "name": user.name,

        "total": total,

        "high": high,

        "low": low,

        "latest": latest

    }
