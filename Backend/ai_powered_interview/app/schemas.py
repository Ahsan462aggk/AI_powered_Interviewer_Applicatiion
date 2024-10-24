# app/schemas.py
from typing import List, Optional, Union
from datetime import datetime
from sqlmodel import SQLModel
from pydantic import BaseModel, EmailStr


class CategoryCreate(SQLModel):
    name: str


class CategoryRead(SQLModel):
    id: int
    name: str


class SessionCreate(SQLModel):
    pass  # Assuming category_id is provided via header


class SessionRead(SQLModel):
    id: int
    user_id: int  # Changed from str to int to match the User model
    category_id: int
    current_question: Optional[str]
    completed: bool
    started_at: datetime


class AnswerCreate(SQLModel):
    answer_text: str  # Only answer_text is required


class AnswerRead(SQLModel):
    id: int
    session_id: int
    question: str
    answer_text: str
    feedback: str
    submitted_at: datetime


class FinalFeedbackItem(BaseModel):
    question: str
    answer: str
    feedback: str


class CompletionResponse(BaseModel):
    message: str



class NextQuestionResponse(BaseModel):
    next_question: str


ResponseModel = Union[CompletionResponse, NextQuestionResponse]


class UserCreate(SQLModel):
    username: str
    email: EmailStr
    password: str


class UserRead(SQLModel):
    id: int
    username: str
    email: EmailStr
    created_at: datetime


# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None
