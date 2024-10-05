from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import timedelta
from passlib.context import CryptContext
from fastapi.middleware.cors import CORSMiddleware

from app.auth_utils import authenticate_user, get_current_user, create_access_token, fake_users_db, ACCESS_TOKEN_EXPIRE_MINUTES
from app.models import Token, User


app = FastAPI()

# cors setting for FE and BE communication
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    # allow requests from these origins
    allow_origins=origins,
    allow_credentials=True,
    # Allow HTTP methods (GET, POST, PUT, etc.)
    allow_methods=["*"],
    # Allow all headers
    allow_headers=["*"],
)

# user and JWT configuration
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
pwd_connect = CryptContext(schemes=["bcrypt"], deprecated="auto")

@app.get("/")
def read_root():
    return {"message": "Welcome to Nevmo Backend"}

# Login route to generate JWT token
@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(fake_users_db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail = "Incorrect username or password",
            headers = {"WWW-Authentication": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Protected route (only accessible via valid token)
@app.get("/users/me/")
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@app.get("/balance/")
# async def getBalance(token: str = Depends(oauth2_scheme)):
async def get_balance(token: str = Depends(oauth2_scheme)):
    return {"balance": "200.00"}