import torch
from PIL import Image
from transformers import AutoProcessor, AutoModelForCausalLM 
from fastapi import FastAPI, HTTPException, Query, Form
import sqlite3
import io
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with your frontend's origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# torch_dtype = torch.float16 if torch.cuda.is_available() else torch.float32

# model = AutoModelForCausalLM.from_pretrained("microsoft/Florence-2-large", torch_dtype=torch_dtype, trust_remote_code=True).to(device)
# processor = AutoProcessor.from_pretrained("microsoft/Florence-2-large", trust_remote_code=True)

prompt = "<OCR>"

DATABASE_FILE = "student_answers.db"  

genai_ideal_answers={
    1: """
    The Transformer architecture is a deep learning model designed for sequence-to-sequence tasks like translation, summarization, and text generation. It eliminates recurrence by relying entirely on attention mechanisms, enabling parallel processing of input tokens. The model consists of an encoder and decoder, each built from layers of multi-head self-attention and feed-forward networks with residual connections and layer normalization. Positional encodings are added to input embeddings to preserve token order. The encoder captures context from the input, while the decoder generates outputs using masked self-attention and encoder outputs. This architecture powers models like BERT and GPT, offering state-of-the-art performance in NLP.
    """,
    2: "RNNs process sequences step-by-step, maintaining a hidden state that captures past information, making them suitable for time-dependent data but slow for long sequences due to their sequential nature. They also struggle with long-range dependencies and vanishing gradients. Transformers, on the other hand, use self-attention to process all tokens in parallel, enabling faster training and better handling of long-term dependencies. Unlike RNNs, they don't rely on sequential processing, allowing efficient use of GPUs. Transformers also include positional encodings to retain order information. Overall, Transformers outperform RNNs in both speed and accuracy, especially on large datasets and complex language tasks.",
    3: "The attention mechanism allows models to focus on the most relevant parts of the input when making predictions. Given queries (Q), keys (K), and values (V), attention computes a weighted sum of the values, where weights are based on the similarity between the query and each key. It enables the model to dynamically highlight important words in a sequence, capturing context more effectively than fixed-size representations. Attention powers the performance of Transformers by allowing global dependency modeling in a parallelizable way.",
    4: "Generative AI raises several ethical concerns. It can produce misleading or false content, contributing to misinformation and deepfakes. AI-generated media may infringe on intellectual property rights and challenge notions of authorship. Bias in training data can lead to discriminatory outputs, reinforcing harmful stereotypes. Privacy risks emerge when models memorize sensitive information. Generative AI can also be misused for malicious purposes, such as fraud or impersonation. Moreover, it raises concerns about job displacement in creative industries. Ensuring transparency, accountability, and fairness in development and deployment is crucial to mitigate these risks and promote responsible use of generative AI technologies."
}

@app.post("/ocr")
def read_image_and_ocr(prn: int = Form(...), subject_code: str = Form(...)):
    print(prn, subject_code)
    # Connect to database
    conn = sqlite3.connect(DATABASE_FILE)
    cursor = conn.cursor()

    cursor.execute('''
        SELECT * FROM answer_sheets1 WHERE prn = ? AND subject_code = ?
    ''', (prn, subject_code))
    
    rows = cursor.fetchall()
    total_score = 0
    for row in rows:
        id, prn_, sub_code_, q_no, score, image_blob = row
        print(id, q_no)
        # image = Image.open(io.BytesIO(image_blob)).convert("RGB")
        # inputs = processor(text=prompt, images=image, return_tensors="pt").to(device, torch_dtype)
        # generated_ids = model.generate(
        #     input_ids=inputs["input_ids"],
        #     pixel_values=inputs["pixel_values"],
        #     max_new_tokens=4096,
        #     num_beams=3,
        #     do_sample=False
        # )
        # generated_text = processor.batch_decode(generated_ids, skip_special_tokens=False)[0]

        # parsed_answer = processor.post_process_generation(generated_text, task="<OCR>", image_size=(image.width, image.height))
        # q_ans = parsed_answer['<OCR>']
        # vectorizer = TfidfVectorizer()
        # # Fit and transform the strings into TF-IDF vectors
        # tfidf_matrix = vectorizer.fit_transform([q_ans, genai_ideal_answers[q_no]])
        # cosine_sim = cosine_similarity(tfidf_matrix[0], tfidf_matrix[1])
        # score = cosine_sim[0][0]
        # score = 0.99
        total_score += score

        print(f"Cosine Similarity: {score}")
        # cursor.execute('''
        #     UPDATE answer_sheets1
        #     SET score = ?
        #     WHERE id = ?
        # ''', (score, id))
        
        # conn.commit()
        
    conn.close()

    if rows is None:
        raise HTTPException(status_code=404, detail="No matching record found.")

    

    return JSONResponse(content={
        "total_score": round(total_score * 5, 2)
    })

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8010)