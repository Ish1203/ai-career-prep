from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import uvicorn

from routes import interview, resume, exam

app = FastAPI(title="AI Career Prep API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(interview.router, prefix="/interview", tags=["Interview"])
app.include_router(resume.router, prefix="/resume", tags=["Resume"])
app.include_router(exam.router, prefix="/exam", tags=["Exam"])

@app.get("/")
def root():
    return {"message": "AI Career Prep API is running!"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
