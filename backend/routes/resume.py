from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from xai_client import call_claude
import pdfplumber
import io

router = APIRouter()

def extract_text_from_pdf(file_bytes: bytes) -> str:
    text = ""
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text.strip()

@router.post("/analyse")
async def analyse_resume(
    file: UploadFile = File(...),
    target_role: str = Form("Software Developer")
):
    try:
        if not file.filename.endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Only PDF files are supported")
        
        file_bytes = await file.read()
        resume_text = extract_text_from_pdf(file_bytes)
        
        if not resume_text:
            raise HTTPException(status_code=400, detail="Could not extract text from PDF")
        
        system = """You are an expert resume reviewer and ATS (Applicant Tracking System) specialist with 10+ years of hiring experience at top tech companies."""
        
        prompt = f"""Analyse this resume for a {target_role} position and return a detailed JSON report with this exact structure:

{{
  "ats_score": <number 0-100>,
  "overall_score": <number 0-10>,
  "summary": "<2-3 sentence overall assessment>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
  "missing_keywords": ["<keyword 1>", "<keyword 2>", "<keyword 3>", "<keyword 4>", "<keyword 5>"],
  "sections_feedback": {{
    "experience": "<feedback on work experience section>",
    "skills": "<feedback on skills section>",
    "education": "<feedback on education section>",
    "projects": "<feedback on projects section>",
    "summary_section": "<feedback on professional summary if present>"
  }},
  "bullet_point_rewrites": [
    {{"original": "<original bullet>", "improved": "<improved version>"}},
    {{"original": "<original bullet>", "improved": "<improved version>"}}
  ],
  "top_recommendations": [
    "<actionable recommendation 1>",
    "<actionable recommendation 2>",
    "<actionable recommendation 3>",
    "<actionable recommendation 4>",
    "<actionable recommendation 5>"
  ],
  "readiness": "<Ready / Almost Ready / Needs Work>"
}}

Resume text:
{resume_text}

Return ONLY valid JSON, no markdown, no extra text."""

        response = call_claude(system, [{"role": "user", "content": prompt}], max_tokens=2000)
        
        import json
        try:
            result = json.loads(response)
        except:
            cleaned = response.strip().lstrip("```json").lstrip("```").rstrip("```").strip()
            result = json.loads(cleaned)
        
        return result
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/match")
async def match_resume_to_jd(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    try:
        file_bytes = await file.read()
        resume_text = extract_text_from_pdf(file_bytes)
        
        system = "You are an expert recruiter and ATS specialist."
        
        prompt = f"""Compare this resume against the job description and return JSON:

{{
  "match_score": <number 0-100>,
  "matched_keywords": ["<kw1>", "<kw2>", "<kw3>"],
  "missing_keywords": ["<kw1>", "<kw2>", "<kw3>"],
  "verdict": "<Strong Match / Moderate Match / Weak Match>",
  "tips": ["<tip1>", "<tip2>", "<tip3>"]
}}

Resume:
{resume_text}

Job Description:
{job_description}

Return ONLY valid JSON."""

        response = call_claude(system, [{"role": "user", "content": prompt}], max_tokens=1000)
        
        import json
        try:
            result = json.loads(response)
        except:
            cleaned = response.strip().lstrip("```json").lstrip("```").rstrip("```").strip()
            result = json.loads(cleaned)
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
