from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from typing import List, Optional
from xai_client import call_claude
import pdfplumber
import io
import json

router = APIRouter()

class QuizRequest(BaseModel):
    topic: str
    company: Optional[str] = None
    difficulty: str = "medium"
    num_questions: int = 5
    custom_content: Optional[str] = None

class EvaluateRequest(BaseModel):
    question: str
    user_answer: str
    correct_answer: Optional[str] = None
    topic: str

COMPANIES = {
    "TCS": "TCS NQT aptitude, verbal reasoning, programming logic, coding, English",
    "Infosys": "Infosys InfyTQ, mathematical reasoning, logical thinking, verbal ability, pseudocode",
    "Wipro": "Wipro NLTH aptitude, essay writing, coding, communication skills",
    "Cognizant": "Cognizant GenC aptitude, reasoning, verbal, coding in Python/Java",
    "Accenture": "Accenture cognitive assessment, numerical, verbal, attention to detail, coding",
    "Google": "Google data structures, algorithms, system design, behavioral",
    "Microsoft": "Microsoft coding rounds, system design, behavioral, problem solving",
    "Amazon": "Amazon leadership principles, DSA, system design, coding",
    "Flipkart": "Flipkart algorithms, data structures, system design, problem solving",
    "Deloitte": "Deloitte verbal reasoning, numerical, situational judgment, coding"
}

@router.get("/companies")
async def get_companies():
    return {"companies": list(COMPANIES.keys())}

@router.get("/topics")
async def get_topics():
    return {
        "topics": [
            "Data Structures & Algorithms",
            "Operating Systems",
            "Database Management (DBMS)",
            "Computer Networks",
            "Object Oriented Programming",
            "System Design",
            "Aptitude & Reasoning",
            "Python Programming",
            "JavaScript",
            "SQL",
            "Machine Learning Basics",
            "Web Development"
        ]
    }

@router.post("/generate")
async def generate_quiz(req: QuizRequest):
    try:
        context = ""
        if req.company and req.company in COMPANIES:
            context = f"This quiz is specifically for {req.company} campus placement exam which covers: {COMPANIES[req.company]}."
        
        if req.custom_content:
            context += f"\n\nAdditional study material provided by user:\n{req.custom_content}"

        prompt = f"""Generate exactly {req.num_questions} quiz questions on the topic: "{req.topic}".
Difficulty: {req.difficulty}
{context}

Return ONLY a JSON array with this exact structure:
[
  {{
    "id": 1,
    "question": "<question text>",
    "options": ["A. <option>", "B. <option>", "C. <option>", "D. <option>"],
    "correct": "<A/B/C/D>",
    "explanation": "<why this answer is correct>",
    "type": "mcq"
  }}
]

Make questions realistic and at {req.difficulty} difficulty. Return ONLY valid JSON array."""

        system = "You are an expert exam question setter for technical and aptitude tests."
        response = call_claude(system, [{"role": "user", "content": prompt}], max_tokens=2000)
        
        try:
            questions = json.loads(response)
        except:
            cleaned = response.strip().lstrip("```json").lstrip("```").rstrip("```").strip()
            questions = json.loads(cleaned)
        
        return {"questions": questions, "topic": req.topic, "company": req.company}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/evaluate")
async def evaluate_answer(req: EvaluateRequest):
    try:
        prompt = f"""A student answered a {req.topic} question.

Question: {req.question}
Student's Answer: {req.user_answer}
{"Correct Answer: " + req.correct_answer if req.correct_answer else ""}

Evaluate and return JSON:
{{
  "is_correct": <true/false>,
  "score": <0-10>,
  "feedback": "<specific feedback on their answer>",
  "explanation": "<detailed explanation of the correct answer>",
  "tip": "<one study tip for this topic>"
}}

Return ONLY valid JSON."""
        
        system = "You are an expert teacher who gives helpful, encouraging feedback."
        response = call_claude(system, [{"role": "user", "content": prompt}])
        
        try:
            result = json.loads(response)
        except:
            cleaned = response.strip().lstrip("```json").lstrip("```").rstrip("```").strip()
            result = json.loads(cleaned)
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/upload-material")
async def upload_study_material(file: UploadFile = File(...)):
    try:
        if not file.filename.endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Only PDF files supported")
        
        file_bytes = await file.read()
        text = ""
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        
        return {"content": text[:5000], "filename": file.filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
