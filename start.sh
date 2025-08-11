#!/bin/bash

# Sentiment Scope - Modern AI-Powered Sentiment Analysis
# Beautiful Landing Page + Advanced Analysis Tool

echo "🚀 Starting Sentiment Scope - AI-Powered Sentiment Analysis"
echo "============================================================"
echo "✨ Features: Beautiful Landing Page | Real-time Analysis | Modern UI"
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install requirements
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Download NLTK data if needed
echo "📚 Setting up NLTK data..."
python3 -c "
import nltk
try:
    nltk.data.find('corpora/stopwords')
    print('✅ NLTK stopwords already downloaded')
except LookupError:
    print('📥 Downloading NLTK stopwords...')
    nltk.download('stopwords')
    print('✅ NLTK stopwords downloaded successfully')
"

echo ""
echo "🎨 Starting Sentiment Scope Web Application..."
echo "🌟 Features Available:"
echo "   • Beautiful Landing Page with AI animations"
echo "   • Real-time Sentiment Analysis"
echo "   • Modern responsive design"
echo "   • Interactive examples and demos"
echo ""
echo "🌐 Access your application at:"
echo "   📱 Open your browser and go to: http://localhost:8080"
echo ""
echo "📱 Navigation:"
echo "   • Landing Page: http://localhost:8080"
echo "   • Analysis Tool: http://localhost:8080/analyze"
echo ""
echo "⌨️  Press Ctrl+C to stop the server"
echo "============================================================"
echo ""

# Start the Flask application
python3 app.py
