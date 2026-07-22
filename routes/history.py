from fastapi import APIRouter, Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from database.database import get_db
from database.models import User, Prediction
from utils.auth import verify_token

router = APIRouter(tags=["History"])

security = HTTPBearer()


@router.get("/history")
def get_history(
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

    email = payload["sub"]

    user = db.query(User).filter(
        User.email == email
    ).first()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    history = db.query(Prediction).filter(
        Prediction.user_id == user.id
    ).order_by(
        Prediction.created_at.desc()
    ).all()

    return history