from pydantic import BaseModel

class VideoUrl(BaseModel):
    url: str

class ChatRequest(BaseModel):
    user_input: str
    video_id: str