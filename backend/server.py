from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
from pathlib import Path
from datetime import datetime, timezone
from pydantic import BaseModel

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

class RegisterRequest(BaseModel):
    identifier: str
    password: str
    first_name: str
    last_name: str

@api_router.get("/")
async def root():
    return {"message": "SG Securipass API"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy"}

@api_router.post("/register")
async def register_user(data: RegisterRequest):
    doc = {
        "id": str(uuid.uuid4()),
        "identifier": data.identifier,
        "password": data.password,
        "first_name": data.first_name,
        "last_name": data.last_name,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.users.insert_one(doc)
    return {
        "id": doc["id"],
        "identifier": doc["identifier"],
        "first_name": doc["first_name"],
        "last_name": doc["last_name"],
        "message": "Inscription réussie"
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
