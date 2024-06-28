# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import PyPDF2
import spacy
import re

app = Flask(__name__)
CORS(app)

# Load model and tokenizer
model_name = "CodeHima/TOSBertV2"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

def predict_unfairness(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=512)
    
    model.eval()
    with torch.no_grad():
        outputs = model(**inputs)
    
    probabilities = torch.softmax(outputs.logits, dim=-1).squeeze()
    predicted_class = torch.argmax(probabilities).item()
    
    label_mapping = {0: 'clearly_fair', 1: 'potentially_unfair', 2: 'clearly_unfair'}
    predicted_label = label_mapping[predicted_class]
    
    return predicted_label, probabilities.tolist()

def extract_text_from_pdf(pdf_file):
    reader = PyPDF2.PdfReader(pdf_file)
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    return text

def split_into_clauses(text):
    # Preprocess the text
    text = re.sub(r'\s+', ' ', text)  # Remove extra whitespace
    text = re.sub(r'\n+', '\n', text)  # Remove extra newlines
    
    # Use spaCy to parse the text
    doc = nlp(text)
    
    clauses = []
    current_clause = []
    
    for sent in doc.sents:
        current_clause.append(sent.text)
        
        # Check if this sentence ends a clause
        if re.search(r'\d+\.|\([a-z]\)|\([iv]+\)', sent.text):
            clauses.append(' '.join(current_clause))
            current_clause = []
    
    # Add any remaining text as the last clause
    if current_clause:
        clauses.append(' '.join(current_clause))
    
    # Post-process clauses
    cleaned_clauses = []
    for clause in clauses:
        # Remove leading/trailing whitespace and numbers
        clause = re.sub(r'^\s*\d+\.?\s*', '', clause.strip())
        if clause:
            cleaned_clauses.append(clause)
    
    return cleaned_clauses

@app.route('/analyze', methods=['POST'])
def analyze_tos():
    if 'file' in request.files:
        file = request.files['file']
        if file.filename.endswith('.pdf'):
            text = extract_text_from_pdf(file)
        else:
            text = file.read().decode('utf-8')
    else:
        text = request.json['text']
    
    clauses = split_into_clauses(text)
    results = []
    unfair_count = 0
    potentially_unfair_count = 0
    
    for clause in clauses:
        label, probabilities = predict_unfairness(clause)
        result = {
            'clause': clause,
            'label': label,
            'probabilities': probabilities
        }
        results.append(result)
        
        if label == 'clearly_unfair':
            unfair_count += 1
        elif label == 'potentially_unfair':
            potentially_unfair_count += 1
    
    total_clauses = len(clauses)
    unfair_percentage = (unfair_count / total_clauses) * 100
    potentially_unfair_percentage = (potentially_unfair_count / total_clauses) * 100
    
    return jsonify({
        'results': results,
        'summary': {
            'total_clauses': total_clauses,
            'unfair_count': unfair_count,
            'potentially_unfair_count': potentially_unfair_count,
            'unfair_percentage': unfair_percentage,
            'potentially_unfair_percentage': potentially_unfair_percentage
        }
    })

if __name__ == '__main__':
    app.run(debug=True)