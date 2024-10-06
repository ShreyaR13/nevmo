from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import timedelta
from passlib.context import CryptContext
from fastapi.middleware.cors import CORSMiddleware

from app.auth_utils import authenticate_user, get_current_user, create_access_token, fake_users_db, ACCESS_TOKEN_EXPIRE_MINUTES
from app.models import Token, User, UserWithBalance, SendMoneyRequest


app = FastAPI()

# cors setting for FE and BE communication
origins = [
    "https://nevmo-react-frontend.onrender.com",
    "http://localhost:3000"
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
# async def getBalance(token: str = Depends(oauth2_scheme)): accessible to all users
async def get_balance(current_user: UserWithBalance = Depends(get_current_user)):
    return current_user # Only accessible by authenticated users

@app.post("/send-money/")
async def send_money(request: SendMoneyRequest, current_user: dict = Depends(get_current_user)):
    sender = current_user["username"]

    if request.amount > current_user["balance"]:
        raise HTTPException(status_code=400, detail="Insufficient balance")

    # Find recipient in DB
    recipient = fake_users_db.get(request.recipient)
    if not recipient:
        raise HTTPException(status_code=400, detail="Recipient not found")
    
    # deduct balance
    current_user["balance"] -= request.amount
    # update sender's balance in db
    fake_users_db[sender]["balance"] = current_user["balance"]

    # add balance to recipient
    recipient["balance"] += request.amount
    fake_users_db[request.recipient]["balance"] = recipient["balance"]

    return {"message": "Money sent successfully", "new_balance": current_user["balance"]}