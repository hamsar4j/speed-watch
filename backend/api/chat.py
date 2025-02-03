from fastapi import APIRouter, HTTPException
from models.models import ChatRequest
from services.chatbot import stream_graph_updates
from database.db import get_db_connection
from utils import extract_video_id

router = APIRouter()

@router.post("/chat")
async def chat(request: ChatRequest):
    """Retrieves video summary and answers user questions using LangChain chatbot."""
    try:
        # retrieve summary from database
        video_id = extract_video_id(request.video_url)
        conn, c = get_db_connection()
        c.execute("SELECT summary FROM summaries WHERE video_id = ?", (video_id,))
        result = c.fetchone()
        conn.close()

        if not result:
            raise HTTPException(status_code=404, detail="Summary not found")

        summary = result[0]
        user_message = f"Here is a summary of a YouTube video: {summary}\n\nUser question: {request.user_input}"

        # use chatbot for response
        response = stream_graph_updates(user_message)

        return {"response": response}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
