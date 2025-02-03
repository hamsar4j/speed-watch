from database.db import conn, c

def save_summary(video_id: str, summary: str):
    c.execute("INSERT OR REPLACE INTO summaries (video_id, summary) VALUES (?, ?)", (video_id, summary))
    conn.commit()

def get_summary(video_id: str):
    c.execute("SELECT summary FROM summaries WHERE video_id = ?", (video_id,))
    result = c.fetchone()
    return result[0] if result else None