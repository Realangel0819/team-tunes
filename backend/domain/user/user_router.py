from datetime import timedelta, datetime

from fastapi import APIRouter, HTTPException, Depends, Form
from fastapi.security import OAuth2PasswordRequestForm
from jose import jwt
from sqlalchemy.orm import Session
from starlette import status

from database import get_db
from domain.user import user_crud, user_schema
from domain.user.user_crud import pwd_context

ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24
SECRET_KEY = "4ab2fce7a6bd79e1c014396315ed322dd6edb1c5d975c6b74a2904135172c03c"
ALGORITHM = "HS256"

router = APIRouter(
    prefix="/user",
)

# ✅ 회원가입 (폼데이터로 받음)
@router.post("/create", status_code=status.HTTP_204_NO_CONTENT)
def user_create(
    username: str = Form(...),
    email: str = Form(...),  # <- 이메일 필드 추가!
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    user_create_data = user_schema.UserCreate(username=username, email=email ,password=password)

    existing_user = user_crud.get_existing_user(db, user_create=user_create_data)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="이미 존재하는 사용자입니다."
        )
    user_crud.create_user(db=db, user_create=user_create_data)


# ✅ 로그인 (OAuth2PasswordRequestForm은 이미 form-data 방식 처리)
@router.post("/login", response_model=user_schema.Token)

def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = user_crud.get_user(db, form_data.username)
    if not user or not pwd_context.verify(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    data = {
        "sub": user.username,
        "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    }
    access_token = jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "username": user.username
    }
