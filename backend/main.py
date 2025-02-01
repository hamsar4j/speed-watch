from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from youtube_transcript_api import YouTubeTranscriptApi
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
import re
import os


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

# client = OpenAI(
#     base_url = 'http://localhost:11434/v1',
#     api_key='ollama', # required, but unused
# )

client = OpenAI(
    base_url = 'https://api.groq.com/openai/v1',
    api_key=os.getenv("GROQ_API_KEY"), 
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
    response = client.chat.completions.create(
        model="gemma2-9b-it",
        messages=[
            {"role": "system", "content": "Provide a concise summary of the following text. Focus on the key points and main ideas. Return ONLY the summary."},
            {"role": "user", "content": text},
        ]
    )
    return response.choices[0].message.content
