from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

# from utils.auth import create_access_token
from utils.jwt_handler import create_access_token, hash_password, verify_password, verify_token
from database.database import get_db
from database.models import User
from database.schemas import UserCreate, UserLogin
# from utils.auth import *
import traceback



router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    try:

        existing = db.query(User).filter(User.email == user.email).first()

        if existing:
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )

        hashed = hash_password(user.password)

        print("HASH =", hashed)

        new_user = User(
            name=user.name,
            email=user.email,
            phone=user.phone,
            password=hashed
        )

        db.add(new_user)
        db.commit()

        return {"message": "User Registered Successfully"}

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))



@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):

    existing = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing is None:

        raise HTTPException(
            status_code=401,
            detail="Invalid Email"
        )

    if not verify_password(
        user.password,
        existing.password
    ):

        raise HTTPException(
            status_code=401,
            detail="Invalid Password"
        )

    token = create_access_token(
        {
            "sub": existing.email
        }
    )

    return {

        "access_token": token,

        "token_type": "bearer"

    }