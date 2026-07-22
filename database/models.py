from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func

from database.database import Base


class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)

    email = Column(String(100), unique=True, nullable=False)

    phone = Column(String(15))

    password = Column(String(255), nullable=False)

    # created_at = Column(DateTime(timezone=True), server_default=func.now())


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))

    age = Column(Integer)

    resting_bp = Column(Integer)

    cholesterol = Column(Integer)

    max_hr = Column(Integer)

    prediction = Column(String(50))

    probability = Column(Float)

    created_at = Column(DateTime(timezone=True), server_default=func.now())