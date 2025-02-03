from fastapi import APIRouter, HTTPException
from models.models import VideoUrl
from utils import extract_video_id
from services.video import get_video_transcript
from services.chatbot import stream_graph_updates
from database.db import get_db_connection

router = APIRouter()

@router.post("/get_summary")
async def get_summary(request: VideoUrl):
    """Extracts transcript from YouTube video, summarizes it, and stores in the database."""
    try:
        video_id = extract_video_id(request.url)
        transcript = get_video_transcript(video_id)

        # use chatbot for summarization
        summary = stream_graph_updates(f"Summarize this transcript: {transcript}")

        # store summary in database
        conn, c = get_db_connection()
        c.execute("INSERT OR REPLACE INTO summaries (video_id, summary) VALUES (?, ?)", (video_id, summary))
        conn.commit()
        conn.close()

        return {"summary": summary}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))