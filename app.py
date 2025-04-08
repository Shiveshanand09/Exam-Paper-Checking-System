from fastapi import FastAPI, UploadFile, Form
from fastapi.responses import JSONResponse
import sqlite3

from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with your frontend's origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_FILE = "student_answers.db"

def save_image_blob(prn: int, subject_code: str, question_no: int, file: UploadFile):
    conn = sqlite3.connect(DATABASE_FILE)
    cursor = conn.cursor()
    # Create table if not exists
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS answer_sheets1 (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            prn INTEGER NOT NULL,
            subject_code VARCHAR(20) NOT NULL,
            question_no INTEGER NOT NULL,
            score INTEGER,
            image BLOB NOT NULL
        )
    ''')

    # Read image data
    image_data = file.file.read()

    # Insert full record
    cursor.execute('''
        INSERT INTO answer_sheets1 (prn, subject_code, question_no, image)
        VALUES (?, ?, ?, ?)
    ''', (prn, subject_code, question_no, image_data))

    conn.commit()
    conn.close()

@app.post("/upload")
async def upload_image(
    prn: int = Form(...),
    subject_code: str= Form(...),
    question_no: int= Form(...),
    file: UploadFile = Form(...)
):
    try:
        print(prn,subject_code, question_no)
        save_image_blob(prn, subject_code, question_no, file)
        return JSONResponse(content={"message": "Image stored successfully"}, status_code=200)
    except Exception as e:
        print("Error saving image:", e)
        return JSONResponse(content={"error": str(e)}, status_code=500)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
