from fastapi import FastAPI, APIRouter, HTTPException, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import time
import logging
import random
import string
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone

import cloudinary
import cloudinary.utils
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Cloudinary configuration
cloudinary.config(
    cloud_name=os.environ.get("CLOUDINARY_CLOUD_NAME"),
    api_key=os.environ.get("CLOUDINARY_API_KEY"),
    api_secret=os.environ.get("CLOUDINARY_API_SECRET"),
    secure=True,
)

EMERGENT_LLM_KEY = os.environ.get("EMERGENT_LLM_KEY")

app = FastAPI()
api_router = APIRouter(prefix="/api")


# ---------- Models ----------
class Sticker(BaseModel):
    id: str
    type: str  # icon name from lucide-react
    x: float  # percentage 0-100
    y: float
    size: int = 32
    color: str = "#E07A5F"
    rotation: float = 0


class CardCreate(BaseModel):
    sender_name: str
    recipient_name: str
    message: str
    image_url: Optional[str] = None
    image_public_id: Optional[str] = None
    bg_color: str = "#FDFBF7"
    bg_gradient: Optional[str] = None
    font_family: str = "Cormorant Garamond"
    text_color: str = "#2C362B"
    frame: str = "none"
    stickers: List[Sticker] = []
    music_track: Optional[str] = None


class Card(CardCreate):
    id: str
    slug: str
    created_at: str


class AiSuggestRequest(BaseModel):
    recipient_name: str
    tone: str = "heartfelt"  # heartfelt, funny, poetic, simple
    relationship: str = "mother"  # mother, mom, mama, mum
    extra_context: Optional[str] = None


# ---------- Helpers ----------
def generate_slug(length: int = 8) -> str:
    chars = string.ascii_lowercase + string.digits
    return "".join(random.choices(chars, k=length))


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "Mother's Day Card API"}


@api_router.get("/cloudinary/signature")
def cloudinary_signature(folder: str = Query("uploads/mothers-day")):
    if not folder.startswith(("uploads/", "users/", "posts/")):
        raise HTTPException(status_code=400, detail="Invalid folder path")

    timestamp = int(time.time())
    params = {"timestamp": timestamp, "folder": folder}
    signature = cloudinary.utils.api_sign_request(
        params, os.environ["CLOUDINARY_API_SECRET"]
    )
    return {
        "signature": signature,
        "timestamp": timestamp,
        "cloud_name": os.environ["CLOUDINARY_CLOUD_NAME"],
        "api_key": os.environ["CLOUDINARY_API_KEY"],
        "folder": folder,
    }


@api_router.post("/cards", response_model=Card)
async def create_card(payload: CardCreate):
    # generate unique slug
    for _ in range(8):
        slug = generate_slug()
        existing = await db.cards.find_one({"slug": slug}, {"_id": 0, "slug": 1})
        if not existing:
            break
    else:
        raise HTTPException(status_code=500, detail="Could not generate unique slug")

    card_id = str(uuid.uuid4())
    created_at = datetime.now(timezone.utc).isoformat()
    doc = {
        "id": card_id,
        "slug": slug,
        "created_at": created_at,
        **payload.model_dump(),
    }
    await db.cards.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api_router.get("/cards/{slug}", response_model=Card)
async def get_card(slug: str):
    doc = await db.cards.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Card not found")
    return doc


@api_router.post("/ai/suggest-message")
async def ai_suggest_message(req: AiSuggestRequest):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=500, detail="LLM key not configured")

    system = (
        "You are an expert at writing heartfelt, beautiful Mother's Day card "
        "messages. Always respond with EXACTLY 3 distinct message suggestions "
        "separated by the literal token '|||'. No numbering, no preamble, no "
        "explanations. Each message should be 2-4 sentences."
    )
    extra = f" Additional context: {req.extra_context}." if req.extra_context else ""
    prompt = (
        f"Write 3 {req.tone} Mother's Day card messages to a {req.relationship} "
        f"named '{req.recipient_name}'.{extra} "
        f"Make each message unique in style — vary between sentimental, "
        f"appreciative, and personal. Address her by her name naturally."
    )

    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"mday-{uuid.uuid4()}",
            system_message=system,
        ).with_model("openai", "gpt-5.2")
        response = await chat.send_message(UserMessage(text=prompt))
        text = str(response).strip()
        parts = [p.strip() for p in text.split("|||") if p.strip()]
        if len(parts) < 2:
            # fallback split by double newline
            parts = [p.strip() for p in text.split("\n\n") if p.strip()][:3]
        return {"suggestions": parts[:3]}
    except Exception as e:
        logging.exception("AI suggestion failed")
        raise HTTPException(status_code=500, detail=f"AI generation failed: {e}")


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
