from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import ollama
from fastapi import UploadFile, File
import shutil
from rag_system import (
    retrieve_context,
    build_vectorstore
)
from sentiment import detect_sentiment

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    text: str

@app.get("/")
def home():
    return {"message": "ClarifAI Running Successfully"}

@app.post("/upload")

async def upload_document(file: UploadFile = File(...)):

    file_path = f"documents/{file.filename}"

    with open(file_path, "wb") as buffer:

        shutil.copyfileobj(file.file, buffer)

    # Rebuild vectors
    build_vectorstore()

    return {
        "message": f"{file.filename} uploaded successfully and RAG updated"
    }

@app.post("/chat")
def chat(msg: Message):

    # Detect sentiment
    sentiment = detect_sentiment(msg.text)

    # Retrieve RAG context
    context = retrieve_context(msg.text)

    # Tone instructions
    tone_instruction = ""

    if sentiment == "angry":
        tone_instruction = """
Respond politely and empathetically.
Apologize when necessary.
"""

    elif sentiment == "positive":
        tone_instruction = """
Respond warmly and appreciatively.
"""

    else:
        tone_instruction = """
Respond professionally and clearly.
"""

    # Final prompt
    prompt = f"""
You are ClarifAI customer support assistant for Jaideep General Store.

{tone_instruction}

Use ONLY the provided company information.

Company Information:
{context}

Customer Question:
{msg.text}
"""

    response = ollama.chat(
        model='phi3:mini',
        messages=[
            {
                'role': 'user',
                'content': prompt,
            },
        ]
    )

    return {
        "reply": response['message']['content'],
        "sentiment": sentiment,
        "context_used": context
    }