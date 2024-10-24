# app/routers/session.py
from fastapi import APIRouter, Depends, HTTPException, Header
from typing import Optional, List, Union
from sqlmodel import Session
from app import crud, models, schemas
from app.database import get_session
from app.services.langchain import generate_question, generate_feedback
from app.dependencies import get_current_user

router = APIRouter(prefix="/session", tags=["Session"])


@router.post("/init", response_model=schemas.SessionRead)
async def initialize_session(
    session_create: schemas.SessionCreate,
    db: Session = Depends(get_session),
    category_id: Optional[int] = Header(
        None,
        alias="X-Category-ID",
        description="ID of the category",
        title="Category ID"
    ),
    current_user: models.User = Depends(get_current_user)  # Get the authenticated user
):
    """
    Initializes a new interview session for the authenticated user within a specified category.

    **Endpoint:** POST /session/init

    **Request Headers:**
    - Cookie: access_token=<JWT token>
    - X-Category-ID: <category_id>

    **Request Body:**
    {}

    **Response:**
    {
      "id": 1,
      "user_id": 1,
      "category_id": 1,
      "current_question": "What is polymorphism in Object-Oriented Programming?",
      "completed": false,
      "started_at": "2024-10-24T12:55:03.789012"
    }

    **Error Responses:**
    - 400 Bad Request: Missing X-Category-ID header.
    - 404 Not Found: Category not found.
    - 401 Unauthorized: Missing or invalid JWT token.
    """
    if category_id is None:
        raise HTTPException(status_code=400, detail="X-Category-ID header is required.")

    user_id = current_user.id  # Use the authenticated user's ID

    # Fetch category by ID
    category = crud.get_category_by_id(db, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found.")

    # Generate first question using the updated generate_question function
    try:
        question = await generate_question(category.id)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to generate question.") from e

    # Create session with first question
    interview_session = models.Session(
        user_id=user_id,
        category_id=category.id,
        current_question=question
    )
    interview_session = crud.create_session(db, interview_session)
    return interview_session


@router.post("/answer", response_model=schemas.ResponseModel)
async def submit_answer(
    answer_create: schemas.AnswerCreate,
    db: Session = Depends(get_session),
    session_id: Optional[int] = Header(None, description="Session ID"),
    category_id: Optional[int] = Header(
        None,
        alias="X-Category-ID",
        description="Category ID"
    ),
    current_user: models.User = Depends(get_current_user)  # Get the authenticated user
):
    """
    Submits an answer for the current question in the session and retrieves feedback or the next question.

    **Endpoint:** POST /session/answer

    **Request Headers:**
    - Cookie: access_token=<JWT token>
    - Session-ID: <session_id>
    - X-Category-ID: <category_id>

    **Request Body:**
    {
      "answer_text": "Polymorphism allows objects to be treated as instances of their parent class."
    }

    **Response (Next Question):**
    {
      "next_question": "Can you explain the SOLID principles?"
    }

    **Response (Session Completion):**
    {
      "message": "Session completed"
      ]
    }

    **Error Responses:**
    - 400 Bad Request: Missing headers or session already completed.
    - 403 Forbidden: Accessing a session that doesn't belong to the user.
    - 404 Not Found: Session or category not found.
    - 500 Internal Server Error: Failed to generate feedback.
    """
    # Validate headers
    if session_id is None:
        raise HTTPException(status_code=400, detail="Session-ID header is required.")

    if category_id is None:
        raise HTTPException(status_code=400, detail="X-Category-ID header is required.")

    # Retrieve session
    interview_session = crud.get_session(db, session_id)
    if not interview_session:
        raise HTTPException(status_code=404, detail="Session not found.")

    # Ensure the session belongs to the current user
    if interview_session.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this session.")

    # Validate Category ID
    if interview_session.category_id != category_id:
        raise HTTPException(
            status_code=400,
            detail="Provided Category ID does not match the session's Category ID."
        )

    if interview_session.completed:
        raise HTTPException(status_code=400, detail="Session already completed.")

    if not interview_session.current_question:
        raise HTTPException(status_code=400, detail="No current question to answer.")

    # Generate feedback for the current answer
    try:
        feedback = await generate_feedback(interview_session.current_question, answer_create.answer_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to generate feedback.") from e

    # Ensure feedback is generated
    if feedback is None or feedback.strip() == "":
        raise HTTPException(status_code=500, detail="Failed to generate feedback for the answer.")

    # Save the submitted answer with feedback
    answer = models.Answer(
        session_id=interview_session.id,
        question=interview_session.current_question,
        answer_text=answer_create.answer_text,
        feedback=feedback
    )
    crud.add_answer(db, answer)

    # Check the total number of answers submitted so far
    answers = crud.get_answers(db, interview_session.id)
    answers_count = len(answers)  # Assuming `get_answers` includes the latest answer

    max_questions = 5
    if answers_count >= max_questions:
        interview_session.completed = True
        interview_session.current_question = None
        db.add(interview_session)
        db.commit()
        db.refresh(interview_session)

    

    
        return schemas.CompletionResponse(
            message="Session completed",
        
        )

    # Generate the next question
    category = crud.get_category_by_id(db, interview_session.category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found.")

    try:
        next_question = await generate_question(category.id)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to generate next question.") from e

    # Update the session with the new question
    interview_session.current_question = next_question
    db.add(interview_session)
    db.commit()
    db.refresh(interview_session)

    # Return feedback and the next question
    return schemas.NextQuestionResponse(
        next_question=next_question
    )


@router.get("/final", response_model=List[schemas.FinalFeedbackItem])
def get_final_feedback(
    db: Session = Depends(get_session),
    session_id: Optional[int] = Header(None, description="Session ID"),
    current_user: models.User = Depends(get_current_user)  # Get the authenticated user
):
    """
    Retrieves the final feedback for a completed session.

    **Endpoint:** GET /session/final

    **Request Headers:**
    - Cookie: access_token=<JWT token>
    - Session-ID: <session_id>

    **Response:**
    [
      {
        "question": "What is polymorphism in Object-Oriented Programming?",
        "answer": "Polymorphism allows objects to be treated as instances of their parent class.",
        "feedback": "Good explanation. Consider adding examples to illustrate."
      },
      // More feedback items...
    ]

    **Error Responses:**
    - 400 Bad Request: Missing Session-ID header or session not completed.
    - 403 Forbidden: Accessing a session that doesn't belong to the user.
    - 404 Not Found: Session not found.
    - 401 Unauthorized: Missing or invalid JWT token.
    """
    if session_id is None:
        raise HTTPException(status_code=400, detail="Session-ID header is required.")

    interview_session = crud.get_session(db, session_id)
    if not interview_session:
        raise HTTPException(status_code=404, detail="Session not found.")

    # Ensure the session belongs to the current user
    if interview_session.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this session.")

    if not interview_session.completed:
        raise HTTPException(status_code=400, detail="Session not completed yet.")

    answers = crud.get_answers(db, session_id)
    final_feedback = [
        schemas.FinalFeedbackItem(
            question=answer.question,
            answer=answer.answer_text,
            feedback=answer.feedback
        )
        for answer in answers
    ]
    return final_feedback
