from typing import Annotated
from typing_extensions import TypedDict
from langgraph.graph.message import add_messages
import re

class State(TypedDict):
    # Messages have the type "list". The `add_messages` function
    # in the annotation defines how this state key should be updated
    # (in this case, it appends messages to the list, rather than overwriting them)
    messages: Annotated[list, add_messages]

def extract_video_id(url: str):
    match = re.search(r'v=([^&]+)', url)
    if not match:
        raise ValueError("Invalid YouTube URL")
    return match.group(1)