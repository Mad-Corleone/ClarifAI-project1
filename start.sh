#!/bin/bash

# Start Ollama
/usr/local/bin/ollama serve &

# Start Backend
cd ~/Desktop/Clarif/backend

source venv/bin/activate

~/Desktop/Clarif/backend/venv/bin/uvicorn main:app --reload &

# Start Frontend
cd ~/Desktop/Clarif/frontend

npm start