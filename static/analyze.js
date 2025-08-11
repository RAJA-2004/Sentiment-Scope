// DOM Elements
const textInput = document.getElementById('textInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const clearBtn = document.getElementById('clearBtn');
const resultSection = document.getElementById('resultSection');
const resultContent = document.getElementById('resultContent');
const charCount = document.getElementById('charCount');
const sampleCards = document.querySelectorAll('.sample-card');
const toastContainer = document.getElementById('toastContainer');

// Character counter
textInput.addEventListener('input', () => {
    const count = textInput.value.length;
    charCount.textContent = count;
    
    if (count > 900) {
        charCount.style.color = '#e53e3e';
    } else if (count > 700) {
        charCount.style.color = '#dd6b20';
    } else {
        charCount.style.color = '#718096';
    }
    
    // Auto-resize textarea
    textInput.style.height = 'auto';
    textInput.style.height = Math.min(textInput.scrollHeight, 300) + 'px';
});

// Sample card click handlers
sampleCards.forEach(card => {
    card.addEventListener('click', () => {
        const sampleText = card.getAttribute('data-text');
        textInput.value = sampleText;
        textInput.focus();
        
        // Update character counter
        charCount.textContent = sampleText.length;
        
        // Auto-resize textarea
        textInput.style.height = 'auto';
        textInput.style.height = Math.min(textInput.scrollHeight, 300) + 'px';
        
        // Scroll to input
        textInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Add visual feedback
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
        
        // Show success toast
        showToast('Sample text loaded! Click Analyze to see the result.', 'success');
    });
});

// Clear button handler
clearBtn.addEventListener('click', () => {
    textInput.value = '';
    charCount.textContent = '0';
    hideResult();
    textInput.focus();
    textInput.style.height = 'auto';
    
    showToast('Text cleared successfully!', 'success');
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

// Keyboard shortcuts
textInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        analyzeBtn.click();
    }
});

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

// Functions
function setLoading(isLoading) {
    analyzeBtn.disabled = isLoading;
    analyzeBtn.classList.toggle('loading', isLoading);
    
    if (isLoading) {
        analyzeBtn.style.cursor = 'not-allowed';
    } else {
        analyzeBtn.style.cursor = 'pointer';
    }
}

function displayResult(data) {
    const { sentiment, confidence, message } = data;
    
    let sentimentClass = 'sentiment-mixed';
    let sentimentIcon = 'fas fa-meh';
    
    if (sentiment === 'Positive') {
        sentimentClass = 'sentiment-positive';
        sentimentIcon = 'fas fa-smile';
    } else if (sentiment === 'Negative') {
        sentimentClass = 'sentiment-negative';
        sentimentIcon = 'fas fa-frown';
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
                    <div class="confidence-fill ${confidenceBarClass}" style="width: 0%"></div>
                </div>
            </div>
            ` : ''}
        </div>
        ${message ? `
        <div style="margin-top: 20px; padding: 20px; background: rgba(255, 193, 7, 0.1); border-left: 4px solid #ffc107; border-radius: 10px;">
            <i class="fas fa-info-circle" style="color: #dd6b20; margin-right: 12px;"></i>
            <span style="color: #975a16; font-weight: 500; font-size: 1.1rem;">${message}</span>
        </div>
        ` : ''}
    `;
    
    resultContent.innerHTML = resultHTML;
    showResult();
    
    // Animate confidence bar
    if (confidence > 0) {
        setTimeout(() => {
            const confidenceFill = document.querySelector('.confidence-fill');
            if (confidenceFill) {
                confidenceFill.style.width = confidence + '%';
            }
        }, 300);
    }
}

function showResult() {
    resultSection.classList.remove('hidden');
    setTimeout(() => {
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

function hideResult() {
    resultSection.classList.add('hidden');
}

function showToast(message, type = 'error') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
    
    toast.innerHTML = `
        <i class="${icon}"></i>
        <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Remove toast after 4 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 4000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    textInput.focus();
    
    // Add entrance animations
    const elements = document.querySelectorAll('.analysis-card, .samples-section, .features-info');
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        setTimeout(() => {
            element.style.transition = 'all 0.8s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    // Add hover effects to sample cards
    sampleCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add click ripple effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add ripple animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Enhanced visual feedback
function addGlowEffect(element) {
    element.style.boxShadow = '0 0 20px rgba(102, 126, 234, 0.5)';
    setTimeout(() => {
        element.style.boxShadow = '';
    }, 1000);
}

// Auto-save functionality (optional)
let autoSaveTimer;
textInput.addEventListener('input', () => {
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(() => {
        localStorage.setItem('sentimentAnalysisText', textInput.value);
    }, 1000);
});

// Restore saved text on page load
window.addEventListener('load', () => {
    const savedText = localStorage.getItem('sentimentAnalysisText');
    if (savedText && !textInput.value) {
        textInput.value = savedText;
        charCount.textContent = savedText.length;
    }
});

// Add performance monitoring
const performanceObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        if (entry.entryType === 'measure' && entry.name === 'sentiment-analysis') {
            console.log(`Analysis completed in ${entry.duration.toFixed(2)}ms`);
        }
    }
});

performanceObserver.observe({ entryTypes: ['measure'] });

// Measure analysis performance
function measurePerformance(startMark, endMark, measureName) {
    performance.mark(endMark);
    performance.measure(measureName, startMark, endMark);
}
