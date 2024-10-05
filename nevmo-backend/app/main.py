from fastapi import FastAPI, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from fastapi.middleware.cors import CORSMiddleware


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

@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    return {"access_token": "dummy_token", "token_type": "bearer"}

@app.get("/balance")
async def getBalance(token: str = Depends(oauth2_scheme)):
    return {"balance": "100.00"}