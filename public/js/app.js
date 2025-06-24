// Main application JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initializeTestRunner();
    initializeTooltips();
    initializeAnimations();
    
    console.log('API Test Suite loaded successfully');
});

// Test Runner Functionality
function initializeTestRunner() {
    const runTestsBtn = document.getElementById('runTestsBtn');
    const testProgress = document.getElementById('testProgress');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const testResults = document.getElementById('testResults');

    if (runTestsBtn) {
        runTestsBtn.addEventListener('click', async function() {
            await runTests();
        });
    }

    async function runTests() {
        // Disable button and show progress
        runTestsBtn.disabled = true;
        runTestsBtn.innerHTML = '<span class="loading-spinner me-2"></span>Running Tests...';
        testProgress.style.display = 'block';
        testResults.innerHTML = '';

        try {
            // Progressive status updates
            const statusUpdates = [
                { progress: 10, text: 'Initializing test environment...' },
                { progress: 25, text: 'Setting up database connections...' },
                { progress: 40, text: 'Running authentication tests...' },
                { progress: 65, text: 'Testing protected routes...' },
                { progress: 85, text: 'Validating JWT tokens...' },
                { progress: 95, text: 'Finalizing test results...' }
            ];

            // Simulate progressive updates
            for (let i = 0; i < statusUpdates.length; i++) {
                const update = statusUpdates[i];
                updateProgress(update.progress, update.text);
                await delay(500);
            }

            // Make API call to run tests
            const response = await fetch('/test/run', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || 'Test execution failed');
            }

            updateProgress(100, 'Tests completed successfully!');
            
            // Display results with animation
            setTimeout(() => {
                displayResults(data.results);
                resetButton();
            }, 1000);

        } catch (error) {
            console.error('Error running tests:', error);
            updateProgress(0, 'Test execution failed');
            displayError(error.message);
            resetButton();
        }
    }

    function updateProgress(percentage, text) {
        if (progressBar && progressText) {
            progressBar.style.width = percentage + '%';
            progressBar.setAttribute('aria-valuenow', percentage);
            progressText.textContent = text;
            
            // Add color coding based on progress
            progressBar.className = 'progress-bar progress-bar-striped progress-bar-animated';
            if (percentage === 100) {
                progressBar.classList.add('bg-success');
            } else if (percentage > 50) {
                progressBar.classList.add('bg-info');
            } else {
                progressBar.classList.add('bg-primary');
            }
        }
    }

    function resetButton() {
        if (runTestsBtn && testProgress) {
            runTestsBtn.disabled = false;
            runTestsBtn.innerHTML = '<i class="fas fa-play me-2"></i>Run All Tests';
            
            // Hide progress after a delay
            setTimeout(() => {
                testProgress.style.display = 'none';
            }, 2000);
        }
    }

    function displayResults(results) {
        if (!results || results.length === 0) {
            testResults.innerHTML = `
                <div class="alert alert-warning fade-in">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    <strong>No Results:</strong> No test results to display.
                </div>
            `;
            return;
        }

        const passed = results.filter(r => r.status === 'passed').length;
        const failed = results.filter(r => r.status === 'failed').length;
        const total = results.length;
        const successRate = Math.round((passed / total) * 100);

        // Generate summary
        let html = `
            <div class="row mb-4 fade-in">
                <div class="col-md-6 mb-3">
                    <div class="card border-0 shadow-sm ${successRate === 100 ? 'bg-success' : successRate >= 80 ? 'bg-info' : 'bg-warning'} text-white">
                        <div class="card-body text-center">
                            <h3 class="fw-bold">${passed}/${total}</h3>
                            <p class="mb-0">
                                <i class="fas fa-check-circle me-2"></i>
                                Tests Passed
                            </p>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 mb-3">
                    <div class="card border-0 shadow-sm bg-primary text-white">
                        <div class="card-body text-center">
                            <h3 class="fw-bold">${successRate}%</h3>
                            <p class="mb-0">
                                <i class="fas fa-percentage me-2"></i>
                                Success Rate
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Group results by suite
        const suites = groupResultsBySuite(results);
        
        html += '<div class="test-results-list">';
        
        Object.keys(suites).forEach(suiteName => {
            const suiteResults = suites[suiteName];
            const suitePassed = suiteResults.filter(r => r.status === 'passed').length;
            const suiteTotal = suiteResults.length;
            const suiteSuccessRate = Math.round((suitePassed / suiteTotal) * 100);
            
            html += `
                <div class="card mb-4 slide-up">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="mb-0 fw-semibold">
                            <i class="fas fa-folder-open me-2"></i>
                            ${suiteName}
                        </h5>
                        <div>
                            <span class="badge bg-light text-dark me-2">${suitePassed}/${suiteTotal}</span>
                            <span class="badge ${suiteSuccessRate === 100 ? 'bg-success' : suiteSuccessRate >= 80 ? 'bg-warning' : 'bg-danger'}">
                                ${suiteSuccessRate}%
                            </span>
                        </div>
                    </div>
                    <div class="card-body p-0">
            `;
            
            suiteResults.forEach((result, index) => {
                const statusClass = result.status === 'passed' ? 'success' : 'danger';
                const statusIcon = result.status === 'passed' ? 'check-circle' : 'times-circle';
                
                html += `
                    <div class="border-bottom p-3 ${index === suiteResults.length - 1 ? 'border-0' : ''}">
                        <div class="d-flex align-items-start">
                            <div class="me-3 mt-1">
                                <i class="fas fa-${statusIcon} text-${statusClass}"></i>
                            </div>
                            <div class="flex-grow-1">
                                <h6 class="mb-1 fw-semibold">${escapeHtml(result.title)}</h6>
                                <p class="text-muted mb-1 small">${escapeHtml(result.description)}</p>
                                ${result.error ? `
                                    <div class="alert alert-danger alert-sm mb-2">
                                        <i class="fas fa-exclamation-triangle me-1"></i>
                                        <small><strong>Error:</strong> ${escapeHtml(result.error)}</small>
                                    </div>
                                ` : ''}
                            </div>
                            <div class="text-end">
                                <span class="badge bg-${statusClass} mb-1">${result.status.toUpperCase()}</span>
                                <div class="text-muted small">
                                    <i class="fas fa-clock me-1"></i>
                                    ${result.duration}ms
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        });

        html += `
            </div>
            <div class="text-center mt-4 fade-in">
                <a href="/test/results" class="btn btn-outline-primary me-2">
                    <i class="fas fa-external-link-alt me-2"></i>
                    View Detailed Results
                </a>
                <button onclick="shareResults()" class="btn btn-outline-success">
                    <i class="fas fa-share-alt me-2"></i>
                    Share Results
                </button>
            </div>
        `;

        testResults.innerHTML = html;
        
        // Trigger animations
        setTimeout(() => {
            const elements = testResults.querySelectorAll('.slide-up');
            elements.forEach((el, index) => {
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }, 100);
    }

    function displayError(message) {
        testResults.innerHTML = `
            <div class="alert alert-danger fade-in">
                <div class="d-flex align-items-center">
                    <i class="fas fa-exclamation-circle fa-2x me-3"></i>
                    <div>
                        <h5 class="alert-heading mb-1">Test Execution Failed</h5>
                        <p class="mb-0">${escapeHtml(message)}</p>
                    </div>
                </div>
                <hr>
                <div class="mb-0">
                    <button onclick="location.reload()" class="btn btn-outline-danger btn-sm">
                        <i class="fas fa-redo me-1"></i>
                        Retry
                    </button>
                </div>
            </div>
        `;
    }
}

// Utility Functions
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function groupResultsBySuite(results) {
    const suites = {};
    results.forEach(result => {
        const suiteName = result.suite || 'General Tests';
        if (!suites[suiteName]) {
            suites[suiteName] = [];
        }
        suites[suiteName].push(result);
    });
    return suites;
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// Initialize Bootstrap Tooltips
function initializeTooltips() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}

// Initialize Animations
function initializeAnimations() {
    // Observe elements for animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    });

    // Observe all cards
    document.querySelectorAll('.card').forEach(card => {
        observer.observe(card);
    });
}

// Share Results Function
function shareResults() {
    const results = document.getElementById('testResults');
    if (results && results.innerHTML) {
        const shareData = {
            title: 'API Test Results',
            text: 'Check out my API test results!',
            url: window.location.href
        };

        if (navigator.share) {
            navigator.share(shareData)
                .then(() => console.log('Shared successfully'))
                .catch(err => console.log('Error sharing:', err));
        } else {
            // Fallback: copy to clipboard
            const url = window.location.href;
            navigator.clipboard.writeText(url).then(() => {
                showToast('Link copied to clipboard!', 'success');
            }).catch(() => {
                showToast('Unable to copy link', 'error');
            });
        }
    }
}

// Toast Notification Function
function showToast(message, type = 'info') {
    const toastContainer = getOrCreateToastContainer();
    const toastId = 'toast-' + Date.now();
    
    const toastHtml = `
        <div id="${toastId}" class="toast align-items-center text-white bg-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'primary'} border-0" role="alert">
            <div class="d-flex">
                <div class="toast-body">
                    <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation-triangle' : 'info'} me-2"></i>
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHtml);
    
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
    
    // Clean up after toast is hidden
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}

function getOrCreateToastContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        container.style.zIndex = '1050';
        document.body.appendChild(container);
    }
    return container;
}

// Keyboard Shortcuts
document.addEventListener('keydown', function(event) {
    // Ctrl/Cmd + Enter to run tests
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        const runTestsBtn = document.getElementById('runTestsBtn');
        if (runTestsBtn && !runTestsBtn.disabled) {
            runTestsBtn.click();
        }
    }
    
    // Escape to cancel (if running)
    if (event.key === 'Escape') {
        const runTestsBtn = document.getElementById('runTestsBtn');
        if (runTestsBtn && runTestsBtn.disabled) {
            location.reload();
        }
    }
});

// Auto-refresh results every 30 seconds if on results page
if (window.location.pathname.includes('/results')) {
    setInterval(() => {
        fetch('/test/api/results')
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    // Check if results have changed
                    const currentResults = JSON.stringify(data);
                    const storedResults = sessionStorage.getItem('lastResults');
                    
                    if (currentResults !== storedResults) {
                        sessionStorage.setItem('lastResults', currentResults);
                        // Optionally refresh the page or update results dynamically
                        showToast('New test results available', 'info');
                    }
                }
            })
            .catch(error => console.log('Error checking for updates:', error));
    }, 30000);
}

// Performance monitoring
window.addEventListener('load', function() {
    const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
    console.log(`Page loaded in ${loadTime}ms`);
});

// Error handling for uncaught errors
window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
    showToast('An unexpected error occurred', 'error');
});

// Service Worker registration (if needed for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment if you want PWA features
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}