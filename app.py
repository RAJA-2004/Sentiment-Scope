from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import pickle
import re
import os
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer
import nltk

# Download required NLTK data
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

app = Flask(__name__)
CORS(app)

# Load trained ML model and vectorizer
try:
    with open('model/trained_model.sav', 'rb') as model_file:
        model = pickle.load(model_file)
    with open('model/tfidf_vectorizer.pkl', 'rb') as vectorizer_file:
        vectorizer = pickle.load(vectorizer_file)
    print("Models loaded successfully!")
except Exception as e:
    print(f"Error loading models: {e}")
    model = None
    vectorizer = None

# Text preprocessing
port_stem = PorterStemmer()

def stemming(content):
    """
    Preprocess the input text by removing non-alphabetic characters,
    converting to lowercase, removing stop words, and applying stemming.
    """
    stemmed_content = re.sub('[^a-zA-Z]', ' ', content)
    stemmed_content = stemmed_content.lower()
    stemmed_content = stemmed_content.split()
    stemmed_content = [port_stem.stem(word) for word in stemmed_content if word not in stopwords.words('english')]
    stemmed_content = ' '.join(stemmed_content)
    return stemmed_content

def predict_sentiment(sentence):
    """
    Predict the sentiment of the given sentence using the pre-trained model and TF-IDF vectorizer.
    """
    if model is None or vectorizer is None:
        return None
    
    preprocessed_sentence = stemming(sentence)
    transformed_sentence = vectorizer.transform([preprocessed_sentence])
    prediction = model.predict(transformed_sentence)
    confidence = model.predict_proba(transformed_sentence)[0]
    
    sentiment = 'Positive' if prediction[0] == 1 else 'Negative'
    confidence_score = max(confidence) * 100
    
    return {
        'sentiment': sentiment,
        'confidence': round(confidence_score, 2)
    }

def check_contradictory_phrases(sentence):
    """
    Check if the sentence contains contradictory phrases.
    """
    contradictory_phrases = [
        "not good", "not great", "not bad", "not terrible", "not excellent", "not amazing"
    ]
    for phrase in contradictory_phrases:
        if phrase in sentence.lower():
            return True
    return False

@app.route('/')
def index():
    return render_template('landing.html')

@app.route('/analyze')
def analyze_page():
    return render_template('analyze.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        sentence = data.get('text', '').strip()
        
        if not sentence:
            return jsonify({'error': 'Please enter a sentence to analyze.'}), 400
        
        if check_contradictory_phrases(sentence):
            return jsonify({
                'sentiment': 'Mixed',
                'confidence': 0,
                'message': 'The sentence contains both positive and negative sentiments.'
            })
        
        result = predict_sentiment(sentence)
        if result is None:
            return jsonify({'error': 'Model not loaded properly.'}), 500
            
        return jsonify(result)
        
    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8088))
    app.run(debug=False, host='0.0.0.0', port=port)

# For Vercel deployment
def handler(request):
    return app(request.environ, request.start_response)
