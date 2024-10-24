# app/crud.py
from typing import List, Optional
from sqlmodel import Session, select
from app.models import Category, Session as InterviewSession, Answer, User
from passlib.hash import bcrypt


def create_category(session: Session, category: Category) -> Category:
    session.add(category)
    session.commit()
    session.refresh(category)
    return category


def get_categories(session: Session) -> List[Category]:
    return session.exec(select(Category)).all()


def get_category_by_name(session: Session, category_name: str) -> Optional[Category]:
    statement = select(Category).where(Category.name == category_name)
    return session.exec(statement).first()


def get_category_by_id(session: Session, category_id: int) -> Optional[Category]:
    return session.get(Category, category_id)


def create_session(session: Session, session_data: InterviewSession) -> InterviewSession:
    session.add(session_data)
    session.commit()
    session.refresh(session_data)
    return session_data


def get_session(session: Session, session_id: int) -> Optional[InterviewSession]:
    return session.get(InterviewSession, session_id)


def add_answer(session: Session, answer: Answer) -> Answer:
    session.add(answer)
    session.commit()
    session.refresh(answer)
    return answer


def get_answers(session: Session, session_id: int) -> List[Answer]:
    statement = select(Answer).where(Answer.session_id == session_id)
    return session.exec(statement).all()


def create_user(session: Session, user: User, password: str) -> User:
    user.hashed_password = bcrypt.hash(password)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


def get_user_by_username(session: Session, username: str) -> Optional[User]:
    statement = select(User).where(User.username == username)
    return session.exec(statement).first()


def authenticate_user(session: Session, username: str, password: str) -> Optional[User]:
    user = get_user_by_username(session, username)
    if not user:
        return None
    if not user.verify_password(password):
        return None
    return user
