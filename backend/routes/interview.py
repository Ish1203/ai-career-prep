from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from xai_client import call_claude

router = APIRouter()

class Message(BaseModel):
    role: str
    content: str

class InterviewRequest(BaseModel):
    role: str
    interview_type: str  # hr, technical, behavioural
    messages: List[Message]
    question_count: int = 0

class FeedbackRequest(BaseModel):
    role: str
    interview_type: str
    messages: List[Message]

SYSTEM_PROMPT = """You are an expert interviewer and career coach. Your job is to conduct realistic mock interviews.

Rules:
- Ask ONE question at a time
- After the user answers, give brief structured feedback with:
  ✅ What was good
  ⚠️ What to improve
  💡 A better way to phrase it
- Then ask the next question
- Keep a professional but encouraging tone
- After 5 questions, give a final performance summary with scores out of 10 for: Communication, Technical Depth, Confidence, and Overall

Question types by interview_type:
- hr: culture fit, motivation, salary, work style
- technical: coding concepts, system design, problem solving, CS fundamentals  
- behavioural: STAR method, past experiences, teamwork, conflict resolution
"""

@router.post("/chat")
async def interview_chat(req: InterviewRequest):
    try:
        system = SYSTEM_PROMPT + f"\n\nYou are interviewing for the role: {req.role}\nInterview type: {req.interview_type}"
        
        messages = [{"role": m.role, "content": m.content} for m in req.messages]
        
        if len(messages) == 0:
            messages = [{"role": "user", "content": f"Start the {req.interview_type} interview for {req.role} role. Introduce yourself briefly and ask the first question."}]
        
        response = call_claude(system, messages)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/summary")
async def get_summary(req: FeedbackRequest):
    try:
        system = "You are an expert career coach. Analyse the interview conversation and give a detailed final report."
        messages = [{"role": m.role, "content": m.content} for m in req.messages]
        messages.append({
            "role": "user",
            "content": f"Give me a comprehensive final interview performance report for the {req.role} ({req.interview_type}) interview. Include: overall score /10, strengths, weaknesses, top 3 improvement tips, and readiness assessment."
        })
        response = call_claude(system, messages, max_tokens=2000)
        return {"summary": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/roles")
async def get_roles():
    return {
        "roles": [
            "Software Development Engineer (SDE)",
            "Data Analyst",
            "Data Scientist",
            "Product Manager",
            "Frontend Developer",
            "Backend Developer",
            "DevOps Engineer",
            "Business Analyst",
            "Machine Learning Engineer",
            "Full Stack Developer"
        ],
        "types": [
            {"id": "technical", "label": "Technical", "icon": "💻"},
            {"id": "hr", "label": "HR Round", "icon": "🤝"},
            {"id": "behavioural", "label": "Behavioural", "icon": "🧠"}
        ]
    }
