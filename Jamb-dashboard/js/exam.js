// exam.js - FIXED VERSION WITH PATH HANDLING
document.addEventListener('DOMContentLoaded', async function() {
    console.log('=== EXAM PAGE LOADED ===');
    
    const student = localStorage.getItem('studentName') || 'Candidate';
    const subjects = JSON.parse(localStorage.getItem('subjects') || '[]');
    
    console.log('Student:', student);
    console.log('Subjects:', subjects);

    if (!subjects.length) {
        alert('No subjects chosen.');
        location.href = 'index.html';
        return;
    }

    const questionBox = document.getElementById('questionBox');
    questionBox.innerHTML = '<div class="spinner"></div><p>Loading exam questions...</p>';

    document.getElementById('student').textContent = `Candidate: ${student}`;
    document.getElementById('subjectName').textContent = `Subjects: ${subjects.join(', ')}`;

    let bank;
    try {
        console.log('Trying to load questions.json...');
        
        // Try different possible paths
        const possiblePaths = [
            './data/questions.json',
            'data/questions.json',
            '/data/questions.json',
            '../data/questions.json'
        ];
        
        let response;
        for (const path of possiblePaths) {
            console.log('Trying path:', path);
            try {
                response = await fetch(path);
                if (response.ok) break;
            } catch (e) {
                console.log(`Path ${path} failed:`, e.message);
                continue;
            }
        }
        
        if (!response || !response.ok) {
            throw new Error(`Cannot find questions.json. Tried paths: ${possiblePaths.join(', ')}`);
        }
        
        bank = await response.json();
        console.log('Questions loaded successfully!');
        console.log('Available subjects:', Object.keys(bank));

    } catch (e) {
        console.error('Failed to load questions:', e);
        questionBox.innerHTML = `
            <div style="text-align: center; color: red; padding: 20px;">
                <h3>Error Loading Questions</h3>
                <p>${e.message}</p>
                <p><strong>Current folder structure should be:</strong></p>
                <pre style="text-align: left; background: #f5f5f5; padding: 10px; border-radius: 5px;">
Jamb-dashboard/
├── index.html
├── exam.html
├── result.html
├── css/
│   └── style.css
├── js/
│   └── exam.js
└── data/
    └── questions.json
                </pre>
                <button onclick="location.href='index.html'" style="background: #e74c3c; margin-top: 20px;">
                    Return to Registration
                </button>
            </div>
        `;
        return;
    }

    // Build exam structure
    const perSubject = 4;
    const exam = subjects.map(sub => {
        const pool = (bank[sub] || []).slice();
        // Simple shuffle
        for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pool[i], pool[j]] = [pool[j], pool[i]];
        }
        const chosen = pool.slice(0, perSubject);
        return { 
            subject: sub, 
            questions: chosen.map((q, idx) => ({
                ...q,
                number: idx + 1
            }))
        };
    });

    console.log('Exam structure:', exam);

    // Check if we have questions
    const totalQuestions = exam.reduce((total, subject) => total + subject.questions.length, 0);
    if (totalQuestions === 0) {
        questionBox.innerHTML = `
            <div style="text-align: center; color: red;">
                <h3>No Questions Available</h3>
                <p>No questions found for the selected subjects: ${subjects.join(', ')}</p>
                <p>Available subjects in JSON: ${Object.keys(bank).join(', ')}</p>
                <button onclick="location.href='index.html'">Return to Registration</button>
            </div>
        `;
        return;
    }

    // Initialize state
    let currentSubjectIndex = 0;
    let currentQuestionIndex = 0;
    const answers = {};
    const marked = {};

    exam.forEach(s => {
        answers[s.subject] = new Array(s.questions.length).fill(null);
        marked[s.subject] = new Set();
    });

    // Timer
    let totalSeconds = 120 * 60;
    let timerInterval = null;

    // UI Refs
    const studentEl = document.getElementById('student');
    const subjectNameEl = document.getElementById('subjectName');
    const timerEl = document.getElementById('timer');
    const progInner = document.getElementById('timerProgress');
    const qsList = document.getElementById('qsList');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const markBtn = document.getElementById('markBtn');
    const submitBtn = document.getElementById('submitAll');

    function createQuestionNavigation() {
        qsList.innerHTML = '';
        let globalIndex = 0;
        
        exam.forEach((subject, subjectIndex) => {
            subject.questions.forEach((question, questionIndex) => {
                globalIndex++;
                const button = document.createElement('button');
                button.textContent = globalIndex;
                button.title = `${subject.subject} - Question ${question.number}`;
                
                button.addEventListener('click', () => {
                    currentSubjectIndex = subjectIndex;
                    currentQuestionIndex = questionIndex;
                    displayCurrentQuestion();
                });
                
                qsList.appendChild(button);
            });
        });
        
        updateQuestionNavigation();
    }

    function updateQuestionNavigation() {
        const buttons = qsList.querySelectorAll('button');
        let globalIndex = 0;
        
        exam.forEach((subject, subjectIndex) => {
            subject.questions.forEach((question, questionIndex) => {
                const button = buttons[globalIndex];
                button.classList.remove('answered', 'marked', 'current');
                
                if (answers[subject.subject][questionIndex] !== null) {
                    button.classList.add('answered');
                }
                
                if (marked[subject.subject].has(questionIndex)) {
                    button.classList.add('marked');
                }
                
                if (subjectIndex === currentSubjectIndex && questionIndex === currentQuestionIndex) {
                    button.classList.add('current');
                }
                
                globalIndex++;
            });
        });
    }

    function getCurrentSubject() {
        return exam[currentSubjectIndex];
    }

    function getCurrentQuestion() {
        return getCurrentSubject().questions[currentQuestionIndex];
    }

    function displayCurrentQuestion() {
        const subject = getCurrentSubject();
        const question = getCurrentQuestion();
        
        subjectNameEl.textContent = `Subject: ${subject.subject} - Question ${currentQuestionIndex + 1} of ${subject.questions.length}`;
        
        let html = `
            <div class="question-header">
                <h3>Question ${getGlobalQuestionNumber()}</h3>
            </div>
            <div class="question-text">
                <p>${question.question}</p>
            </div>
            <div class="options-container">
        `;
        
        question.options.forEach((option, index) => {
            const isSelected = answers[subject.subject][currentQuestionIndex] === index;
            html += `
                <label class="option ${isSelected ? 'selected' : ''}">
                    <input type="radio" name="answer" value="${index}" ${isSelected ? 'checked' : ''}>
                    <span class="option-text">${option}</span>
                </label>
            `;
        });
        
        html += '</div>';
        
        questionBox.innerHTML = html;
        
        // Add event listeners to options
        questionBox.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', function() {
                selectAnswer(parseInt(this.value));
            });
        });
        
        // Update marked button
        markBtn.textContent = marked[subject.subject].has(currentQuestionIndex) 
            ? 'Unmark Review' 
            : 'Mark for Review';
        
        updateQuestionNavigation();
        updateButtonStates();
    }

    function getGlobalQuestionNumber() {
        let count = 0;
        for (let i = 0; i < currentSubjectIndex; i++) {
            count += exam[i].questions.length;
        }
        return count + currentQuestionIndex + 1;
    }

    function selectAnswer(answerIndex) {
        const subject = getCurrentSubject().subject;
        answers[subject][currentQuestionIndex] = answerIndex;
        updateQuestionNavigation();
    }

    function toggleMarked() {
        const subject = getCurrentSubject().subject;
        if (marked[subject].has(currentQuestionIndex)) {
            marked[subject].delete(currentQuestionIndex);
        } else {
            marked[subject].add(currentQuestionIndex);
        }
        updateQuestionNavigation();
        displayCurrentQuestion();
    }

    function previousQuestion() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
        } else if (currentSubjectIndex > 0) {
            currentSubjectIndex--;
            currentQuestionIndex = exam[currentSubjectIndex].questions.length - 1;
        }
        displayCurrentQuestion();
    }

    function nextQuestion() {
        const currentSubject = getCurrentSubject();
        if (currentQuestionIndex < currentSubject.questions.length - 1) {
            currentQuestionIndex++;
        } else if (currentSubjectIndex < exam.length - 1) {
            currentSubjectIndex++;
            currentQuestionIndex = 0;
        }
        displayCurrentQuestion();
    }

    function updateButtonStates() {
        const currentSubject = getCurrentSubject();
        prevBtn.disabled = (currentSubjectIndex === 0 && currentQuestionIndex === 0);
        nextBtn.disabled = (currentSubjectIndex === exam.length - 1 && 
                           currentQuestionIndex === currentSubject.questions.length - 1);
    }

    function startTimer() {
        updateTimerDisplay();
        
        timerInterval = setInterval(() => {
            totalSeconds--;
            updateTimerDisplay();
            
            if (totalSeconds <= 0) {
                submitExam();
            }
        }, 1000);
    }

    function updateTimerDisplay() {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        timerEl.textContent = `Time: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        const totalTime = 120 * 60;
        const percentage = (totalSeconds / totalTime) * 100;
        progInner.style.width = `${percentage}%`;
        
        if (totalSeconds < 300) {
            timerEl.style.color = 'var(--danger)';
        }
    }

    function setupEventListeners() {
        prevBtn.addEventListener('click', previousQuestion);
        nextBtn.addEventListener('click', nextQuestion);
        markBtn.addEventListener('click', toggleMarked);
        submitBtn.addEventListener('click', confirmSubmission);
    }

    function confirmSubmission() {
        const unanswered = getUnansweredCount();
        let message = 'Are you sure you want to submit your exam?';
        
        if (unanswered > 0) {
            message += `\n\nYou have ${unanswered} unanswered question(s).`;
        }
        
        if (confirm(message)) {
            submitExam();
        }
    }

    function getUnansweredCount() {
        let count = 0;
        exam.forEach(subject => {
            count += answers[subject.subject].filter(answer => answer === null).length;
        });
        return count;
    }

    function submitExam() {
        clearInterval(timerInterval);
        
        // Calculate results
        const results = {};
        exam.forEach(subject => {
            const subjectResults = {
                correct: 0,
                total: subject.questions.length
            };
            
            subject.questions.forEach((question, index) => {
                if (answers[subject.subject][index] === question.correctAnswer) {
                    subjectResults.correct++;
                }
            });
            
            results[subject.subject] = subjectResults;
        });
        
        localStorage.setItem('results', JSON.stringify(results));
        
        // Show submitting state
        document.body.innerHTML = `
            <div class="card" style="text-align: center;">
                <div class="spinner"></div>
                <h3>Submitting Exam...</h3>
                <p>Please wait while we process your results</p>
            </div>
        `;
        
        setTimeout(() => {
            window.location.href = 'result.html';
        }, 2000);
    }

    // Initialize the exam
    createQuestionNavigation();
    startTimer();
    displayCurrentQuestion();
    setupEventListeners();
    
    console.log('Exam initialized successfully!');
});