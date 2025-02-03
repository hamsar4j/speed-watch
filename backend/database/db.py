import sqlite3

DB_PATH = "summaries.db"

def init_db():
    """Initialize database and create necessary tables."""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS summaries (video_id TEXT PRIMARY KEY, summary TEXT)''')
    conn.commit()
    conn.close()

def get_db_connection():
    """Get database connection."""
    conn = sqlite3.connect(DB_PATH)
    return conn, conn.cursor()