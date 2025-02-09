# SpeedWatch

SpeedWatch is a powerful productivity tool designed to help you quickly summarize YouTube videos using Large Language Model (LLM) APIs. Built with Angular and TailwindCSS, SpeedWatch not only extracts and summarizes video content but also acts as an intelligent LLM agent, enabling interactive refinement and deeper insights based on user feedback.

### How It Works

1. Enter the YouTube Video URL: Paste the link of the video you want to summarize.

2. Get a Summary: SpeedWatch retrieves the transcript, processes it using LLM APIs, and delivers a concise summary.

3. Chat with the Bot: Ask follow-up questions or request specific insights about the video through a chatbot powered by LangChain and LangGraph.

4. Refine and Explore: Dive deeper into the content by requesting internet searches using the DuckDuckGo Search Engine tool built into the chatbot.

### Setup

1. Install dependencies

```console
yarn
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. Create .env file at the root project folder

```console
touch .env
echo 'GROQ_API_KEY="YOUR_API_KEY"' >> .env
```

3. Run backend

```console
cd backend
fastapi run
```

4. Run frontend

```console
ng serve
```

![](https://github.com/hamsar4j/speed-watch/blob/main/public/ss_main.png)

![](https://github.com/hamsar4j/speed-watch/blob/main/public/ss_summary.png)

![](https://github.com/hamsar4j/speed-watch/blob/main/public/ss_load.png)

![](https://github.com/hamsar4j/speed-watch/blob/main/public/ss_search.png)
