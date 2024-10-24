# app/models.py
from typing import List, Optional
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship
from passlib.hash import bcrypt


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    email: str = Field(index=True, unique=True)
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    role: str = Field(default="user")

    sessions: List["Session"] = Relationship(back_populates="user")

    def verify_password(self, password: str) -> bool:
        return bcrypt.verify(password, self.hashed_password)


class Category(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True, unique=True)

    sessions: List["Session"] = Relationship(back_populates="category")


class Session(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    category_id: int = Field(foreign_key="category.id")
    current_question: Optional[str] = None
    completed: bool = Field(default=False)
    started_at: datetime = Field(default_factory=datetime.utcnow)

    user: Optional[User] = Relationship(back_populates="sessions")
    category: Optional[Category] = Relationship(back_populates="sessions")
    answers: List["Answer"] = Relationship(back_populates="session")


class Answer(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    session_id: int = Field(foreign_key="session.id")
    question: str
    answer_text: str
    feedback: str
    submitted_at: datetime = Field(default_factory=datetime.utcnow)

    session: Optional[Session] = Relationship(back_populates="answers")
