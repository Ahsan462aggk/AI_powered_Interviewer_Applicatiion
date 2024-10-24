# app/routers/users.py
from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.exc import IntegrityError
from sqlmodel import Session
from app import crud, models, schemas
from app.dependencies import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES, get_current_user
from app.database import get_session
from datetime import timedelta
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter(prefix="/users", tags=["Users"])


@router.post("/register", response_model=schemas.UserRead)
def register_user(user_create: schemas.UserCreate, session: Session = Depends(get_session)):
    """
    Registers a new user.

    - **username**: Unique username for the user.
    - **email**: Unique email address.
    - **password**: Password for the account.
    """
    user = models.User(
        username=user_create.username,
        email=user_create.email,
    )
    try:
        user = crud.create_user(session, user, user_create.password)
    except IntegrityError:
        session.rollback()
        raise HTTPException(status_code=400, detail="Username or email already exists.")
    return user


@router.post("/login", response_model=schemas.Token)
def login_for_access_token(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_session)
):
    """
    Authenticates a user and returns a JWT token set in an HTTP-only cookie.

    - **username**: User's username.
    - **password**: User's password.
    """
    user = crud.authenticate_user(session, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    # Set the JWT token in an HTTP-only cookie
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,  # Set to True in production (requires HTTPS)
        samesite="lax",  # Adjust based on your frontend's requirements
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        expires=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/logout")
def logout(response: Response):
    """
    Logs out the user by clearing the JWT cookie.

    **Endpoint:** POST /users/logout

    **Request Headers:**
    - None

    **Response:**
    - Clears the `access_token` cookie.
    """
    response.delete_cookie("access_token")
    return {"message": "Successfully logged out."}
