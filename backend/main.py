from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from youtube_transcript_api import YouTubeTranscriptApi
from fastapi.middleware.cors import CORSMiddleware
import re


app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:4200",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class VideoUrl(BaseModel):
    url: str

@app.post("/get_summary")
async def get_summary(request: VideoUrl):
    try:
        video_id = extract_video_id(request.url)
        transcript = YouTubeTranscriptApi.get_transcript(video_id)

        text = " ".join([item['text'] for item in transcript])
        summary = summarize(text)
        return {"summary": summary}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

def extract_video_id(url: str):
    match = re.search(r'v=([^&]+)', url)
    if not match:
        raise ValueError("Invalid YouTube URL")
    return match.group(1)

def summarize(text: str):
    return text[:500]
