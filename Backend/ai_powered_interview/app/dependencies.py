# app/dependencies.py
from fastapi import Depends, HTTPException, status, Request
from jose import JWTError, jwt
from sqlmodel import Session
from datetime import datetime, timedelta
from typing import Optional
from app.database import get_session
from app import crud, models, schemas
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Secret key for JWT (ensure to use environment variables in production)
SECRET_KEY = os.getenv("SECRET_KEY")  # Replace with a secure key
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """
    Creates a JWT access token.
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(request: Request, session: Session = Depends(get_session)) -> models.User:
    """
    Retrieves the current user based on the JWT token stored in the HTTP-only cookie.
    """
    token = request.cookies.get("access_token")
    if token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token payload invalid.",
                headers={"WWW-Authenticate": "Bearer"},
            )
        token_data = schemas.TokenData(username=username)
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = crud.get_user_by_username(session, username=token_data.username)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user
