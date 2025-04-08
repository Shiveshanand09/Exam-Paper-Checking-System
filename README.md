# Exam Paper Checking System

This project is a web-based AI application for automatically evaluating student answer sheets. It allows students to upload scanned images of handwritten answers and provides automated scoring based on similarity to ideal answers.

## Features

- Upload scanned answer sheets
- Store answers in a SQLite database
- Score answers using AI-based similarity (TF-IDF + cosine similarity)
- Predefined ideal answers for comparison
- Frontend built with HTML, CSS, JS
- Backend built with FastAPI
- CORS-enabled for API interaction with frontend

---

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: FastAPI, Python
- **Database**: SQLite
- **AI/ML**: Transformers (commented), TF-IDF, Cosine Similarity
- **Libraries**: `fastapi`, `uvicorn`, `torch`, `transformers`, `PIL`, `scikit-learn`

---

##  File Structure

├── index.html # Frontend UI ├── styles.css # Styling ├── script.js # Frontend logic ├── app.py # API to upload image answers ├── main.py # API to calculate scores from stored answers ├── student_answers.db # SQLite DB storing answer images and scores └── README.md # This file


---

##  Installation & Setup

1. **Clone the repository**

```bash
git clone https://github.com/your-username/exam-paper-checking.git
cd exam-paper-checking

Install required Python packages

bash
Copy
Edit
pip install fastapi uvicorn torch transformers scikit-learn pillow
Run the APIs

Upload Answer API:

bash
Copy
Edit
python app.py
Score Calculation API:

bash
Copy
Edit
python main.py

📡 API Endpoints
POST /upload (from app.py)
Uploads image answers with metadata.

Form Data:

prn: int

subject_code: str

question_no: int

file: image file

POST /ocr (from main.py)
Calculates total score based on AI comparison.

Form Data:

prn: int

subject_code: str

Returns:

json
Copy
Edit
{
  "total_score": 18.75
}
 AI Logic
Though currently commented for runtime safety, the app includes infrastructure to:

Extract text using a Transformer-based OCR

Match with ideal answers using TF-IDF vectorization

Score based on cosine similarity between student and ideal answers
