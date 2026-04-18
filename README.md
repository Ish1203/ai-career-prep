# 🚀 AI Career Prep Platform

An AI-powered career preparation platform built with **React + FastAPI + Claude AI**. Helps candidates practice mock interviews, analyse their resumes, and prepare for company exams — all in one place.

## ✨ Features

| Module | What it does |
|---|---|
| 🎤 **Interview Coach** | Practice HR, Technical & Behavioural interviews with real-time AI feedback |
| 📄 **Resume Analyser** | ATS scoring, keyword gap analysis, bullet point rewrites |
| 📚 **Exam Prep** | Quiz generator for TCS, Infosys, Google and more — or upload your own material |

## 🛠️ Tech Stack

- **Frontend**: React 18, React Router, Axios, Framer Motion, React Dropzone
- **Backend**: FastAPI, Python 3.10+
- **AI**: Anthropic Claude API (`claude-sonnet-4-20250514`)
- **PDF Parsing**: pdfplumber
- **Deployment**: Vercel (frontend) + Render (backend)

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com)

---

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/ai-career-prep.git
cd ai-career-prep
```

---

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

# Run the server
python main.py
```

Backend will start at `http://localhost:8000`
API docs available at `http://localhost:8000/docs`

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm start
```

Frontend will start at `http://localhost:3000`

The frontend proxies API calls to `localhost:8000` automatically (configured in package.json).

---

## 📁 Project Structure

```
ai-career-prep/
├── backend/
│   ├── main.py              # FastAPI app entry point
│   ├── claude_client.py     # Anthropic API wrapper
│   ├── requirements.txt
│   ├── .env.example
│   └── routes/
│       ├── interview.py     # Interview Coach endpoints
│       ├── resume.py        # Resume Analyser endpoints
│       └── exam.py          # Exam Prep endpoints
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── package.json
    └── src/
        ├── App.js           # Routing
        ├── index.js         # Entry point
        ├── index.css        # Global styles & design tokens
        ├── components/
        │   └── Layout.js    # Sidebar navigation
        └── pages/
            ├── Home.js      # Landing page
            ├── Interview.js # Mock interview chat UI
            ├── ResumeAnalyser.js  # Resume upload & analysis
            └── ExamPrep.js  # Quiz generator
```

---

## 🌐 Deployment

### Deploy Backend to Render

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repo
4. Set these settings:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variable: `ANTHROPIC_API_KEY=your_key_here`
6. Deploy!

### Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Set:
   - **Root Directory**: `frontend`
   - **Framework**: Create React App
4. Add environment variable:
   - `REACT_APP_API_URL=https://your-render-backend-url.onrender.com`
5. Update `frontend/src/pages/*.js` — replace `/interview`, `/resume`, `/exam` with `process.env.REACT_APP_API_URL + '/interview'` etc.
6. Deploy!

---

## 🔑 Environment Variables

| Variable | Where | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | backend/.env | Your Claude API key from console.anthropic.com |
| `REACT_APP_API_URL` | frontend (Vercel) | Your deployed backend URL (for production) |

---

## 📸 Screenshots

> Add screenshots of your running app here before uploading to GitHub!

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

---

## 📄 License

MIT License — free to use for personal and commercial projects.

---

## 👨‍💻 Built By

Made with ❤️ as a portfolio project to demonstrate full-stack AI development skills.

**Stack highlights for recruiters:**
- REST API design with FastAPI
- LLM integration with Claude (prompt engineering, multi-turn conversations)
- PDF parsing and text extraction
- React SPA with client-side routing
- Responsive, accessible UI with custom design system
