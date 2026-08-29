# AI Job Intelligence & Career Optimization Platform

A complete, modular, secure, scalable web application designed to help candidates optimize their career trajectory through AI/ML-powered insights.

## Core Features
1. **Master Career Profile**: A single source of truth for all candidate information.
2. **AI Resume Parsing**: Deterministic and LLM-assisted extraction of resume data.
3. **4-Layer Matching Engine**: Structured, semantic, feature-based, and ML-scored job fit matching.
4. **ATS Resume Optimization**: Dynamically generates tailored, single-column, ATS-friendly resumes.
5. **Analytics & Application Tracking**: Visualizes job search performance.

## Tech Stack
*   **Frontend**: React, TypeScript, Vite, Tailwind CSS v4.
*   **Backend**: Python, Django, Django REST Framework.
*   **ML/NLP**: Scikit-learn, Sentence Transformers, Spacy, LLM integrations (Gemini).
*   **Database**: PostgreSQL.
*   **Infrastructure**: Docker, Docker Compose.

## Setup
1. Clone the repository.
2. Run `docker-compose up -d` to start the PostgreSQL and Redis instances.
3. Set up the Python backend (`cd backend`, `python -m venv venv`, `pip install -r requirements.txt`).
4. Set up the React frontend (`cd frontend`, `npm install`, `npm run dev`).
