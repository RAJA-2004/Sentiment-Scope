// DOM Elements
const textInput = document.getElementById('textInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const clearBtn = document.getElementById('clearBtn');
const resultSection = document.getElementById('resultSection');
const resultContent = document.getElementById('resultContent');
const charCount = document.getElementById('charCount');
const sampleTexts = document.querySelectorAll('.sample-text');

// Character counter
textInput.addEventListener('input', () => {
    const count = textInput.value.length;
    charCount.textContent = count;
    
    if (count > 900) {
        charCount.style.color = '#dc2626';
    } else if (count > 700) {
        charCount.style.color = '#d97706';
    } else {
        charCount.style.color = '#6b7280';
    }
});

// Sample text click handlers
sampleTexts.forEach(sample => {
    sample.addEventListener('click', () => {
        const sampleText = sample.getAttribute('data-text');
        textInput.value = sampleText;
        textInput.focus();
        
        // Update character counter
        charCount.textContent = sampleText.length;
        
        // Scroll to input
        textInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Add visual feedback
        sample.style.transform = 'scale(0.98)';
        setTimeout(() => {
            sample.style.transform = '';
        }, 150);
    });
});

// Clear button handler
clearBtn.addEventListener('click', () => {
    textInput.value = '';
    charCount.textContent = '0';
    hideResult();
    textInput.focus();
});

// Analyze button handler
analyzeBtn.addEventListener('click', async () => {
    const text = textInput.value.trim();
    
    if (!text) {
        showToast('Please enter some text to analyze.', 'error');
        textInput.focus();
        return;
    }
    
    if (text.length > 1000) {
        showToast('Text is too long. Please limit to 1000 characters.', 'error');
        return;
    }
    
    setLoading(true);
    hideResult();
    
    try {
        const response = await fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: text })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'An error occurred');
        }
        
        displayResult(data);
        showToast('Analysis completed successfully!', 'success');
        
    } catch (error) {
        showToast(error.message || 'Failed to analyze text. Please try again.', 'error');
        console.error('Error:', error);
    } finally {
        setLoading(false);
    }
});

// Enter key handler for textarea
textInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        analyzeBtn.click();
    }
});

// Functions
function setLoading(isLoading) {
    analyzeBtn.disabled = isLoading;
    analyzeBtn.classList.toggle('loading', isLoading);
}

function displayResult(data) {
    const { sentiment, confidence, message } = data;
    
    let sentimentClass = 'sentiment-mixed';
    let sentimentIcon = 'fas fa-meh';
    let sentimentColor = '#d97706';
    
    if (sentiment === 'Positive') {
        sentimentClass = 'sentiment-positive';
        sentimentIcon = 'fas fa-smile';
        sentimentColor = '#059669';
    } else if (sentiment === 'Negative') {
        sentimentClass = 'sentiment-negative';
        sentimentIcon = 'fas fa-frown';
        sentimentColor = '#dc2626';
    }
    
    let confidenceBarClass = sentiment.toLowerCase();
    
    const resultHTML = `
        <div class="sentiment-result">
            <div class="sentiment-label ${sentimentClass}">
                <i class="${sentimentIcon} sentiment-icon"></i>
                <span>${sentiment} Sentiment</span>
            </div>
            ${confidence > 0 ? `
            <div class="confidence-score">
                <span class="confidence-label">Confidence Level</span>
                <span class="confidence-value">${confidence}%</span>
                <div class="confidence-bar">
                    <div class="confidence-fill ${confidenceBarClass}" style="width: ${confidence}%"></div>
                </div>
            </div>
            ` : ''}
        </div>
        ${message ? `
        <div style="margin-top: 15px; padding: 15px; background: rgba(255, 193, 7, 0.1); border-left: 4px solid #ffc107; border-radius: 8px;">
            <i class="fas fa-info-circle" style="color: #d97706; margin-right: 8px;"></i>
            <span style="color: #8b5a00; font-weight: 500;">${message}</span>
        </div>
        ` : ''}
    `;
    
    resultContent.innerHTML = resultHTML;
    showResult();
}

function showResult() {
    resultSection.classList.remove('hidden');
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideResult() {
    resultSection.classList.add('hidden');
}

function showToast(message, type = 'error') {
    const toastId = type === 'error' ? 'errorToast' : 'successToast';
    const messageId = type === 'error' ? 'errorMessage' : 'successMessage';
    
    const toast = document.getElementById(toastId);
    const messageElement = document.getElementById(messageId);
    
    messageElement.textContent = message;
    toast.classList.remove('hidden');
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 300);
    }, 4000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    textInput.focus();
    
    // Add some subtle animations on load
    const cards = document.querySelectorAll('.analysis-card, .samples-section');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

// Add some keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to clear
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        clearBtn.click();
    }
    
    // Escape to clear
    if (e.key === 'Escape') {
        clearBtn.click();
    }
});

// Add auto-resize for textarea
textInput.addEventListener('input', () => {
    textInput.style.height = 'auto';
    textInput.style.height = Math.min(textInput.scrollHeight, 300) + 'px';
});
