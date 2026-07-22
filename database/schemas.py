from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):

    name: str

    email: EmailStr

    phone: str

    password: str


class UserLogin(BaseModel):

    email: EmailStr

    password: str

class UserUpdate(BaseModel):

    name: str

    phone: str