# app/routers/categories.py
from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlmodel import Session
from app import crud, models, schemas
from app.database import get_session
from app.dependencies import get_current_user

router = APIRouter(prefix="/categories", tags=["Categories"])


@router.post("/", response_model=schemas.CategoryRead)
def create_new_category(
    category: schemas.CategoryCreate,
    session: Session = Depends(get_session),
    current_user: models.User = Depends(get_current_user)  # Enforce authentication
):
    """
    Creates a new interview category.

    **Endpoint:** POST /categories/

    **Request Headers:**
    - Cookie: access_token=<JWT token>

    **Request Body:**
    {
      "name": "Software Engineering"
    }

    **Response:**
    {
      "id": 1,
      "name": "Software Engineering"
    }

    **Error Responses:**
    - 400 Bad Request: Category already exists.
    - 401 Unauthorized: Missing or invalid JWT token.
    """
    # Optionally, implement role-based access control here
    # For example, only admins can create categories

    # Check if category already exists to prevent duplicates
    existing_category = crud.get_category_by_name(session, category.name)
    if existing_category:
        raise HTTPException(status_code=400, detail="Category already exists.")

    db_category = models.Category(name=category.name)
    return crud.create_category(session, db_category)


@router.get("/", response_model=List[schemas.CategoryRead])
def read_categories(
    session: Session = Depends(get_session),
    current_user: models.User = Depends(get_current_user)  # Enforce authentication
):
    """
    Retrieves a list of all interview categories.

    **Endpoint:** GET /categories/

    **Request Headers:**
    - Cookie: access_token=<JWT token>

    **Response:**
    [
      {
        "id": 1,
        "name": "Software Engineering"
      },
      {
        "id": 2,
        "name": "Data Science"
      }
    ]

    **Error Responses:**
    - 401 Unauthorized: Missing or invalid JWT token.
    """
    categories = crud.get_categories(session)
    return categories
