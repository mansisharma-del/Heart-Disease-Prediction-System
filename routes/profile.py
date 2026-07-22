from fastapi import APIRouter, Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from database.database import get_db
from database.models import User
from database.schemas import UserUpdate
from utils.auth import verify_token

router = APIRouter(tags=["Profile"])

security = HTTPBearer()


@router.get("/profile")
def get_profile(
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

    return {

        "name": user.name,

        "email": user.email,

        "phone": user.phone

    }

@router.put("/profile")
def update_profile(
    data: UserUpdate,
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

    user.name = data.name
    user.phone = data.phone

    db.commit()
    db.refresh(user)

    return {
        "message": "Profile Updated Successfully"
    }