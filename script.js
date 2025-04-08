document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginPage = document.getElementById('loginPage');
    const subjectsPage = document.getElementById('subjectsPage');
    const questionsPage = document.getElementById('questionsPage');
    const uploadPage = document.getElementById('uploadPage');
    const loginForm = document.getElementById('loginForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const backToSubjects = document.getElementById('backToSubjects');
    const backToQuestions = document.getElementById('backToQuestions');
    const subjectList = document.getElementById('subjectList');
    const questionList = document.getElementById('questionList');
    const questionInfo = document.getElementById('questionInfo');
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const previewArea = document.getElementById('previewArea');
    const submitBtn = document.getElementById('submitBtn');
    const questionsPageTitle = document.getElementById('questionsPageTitle');
    const uploadPageTitle = document.getElementById('uploadPageTitle');
    const processingModal = document.getElementById('processingModal');
    const successModal = document.getElementById('successModal');
    const successOkBtn = document.getElementById('successOkBtn');
    const registerLink = document.getElementById('registerLink');
    const existingSubmission = document.getElementById('existingSubmission');
    const previousSubmission = document.getElementById('previousSubmission');
    
    // State variables
    let currentUser = null;
    let selectedSubject = null;
    let selectedQuestion = null;
    let selectedFile = null;
    
    // API Configuration
    const API_BASE_URL = "http://localhost:8000";
    
    // Mock data - replace with actual API calls later
    const mockSubjects = [
        { 
            id: '101', 
            name: 'Generative AI', 
            code: 'CET4063B', 
            icon: 'fas fa-robot',
            questions: [
                { number: 'Q1', text: 'Explain the transformer architecture' },
                { number: 'Q2', text: 'Compare RNNs vs Transformers' },
                { number: 'Q3', text: 'Explain attention mechanism' },
                { number: 'Q4', text: 'Discuss ethical implications of generative AI' }
            ]
        }
    ];
    
    // Initialize the app
    function init() {
        checkExistingSession();
        setupEventListeners();
        renderSubjects();
    }
    
    // Check for existing user session
    function checkExistingSession() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
            showPage(subjectsPage);
        } else {
            showPage(loginPage);
        }
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Login form submission
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
        
        // Logout button
        logoutBtn.addEventListener('click', handleLogout);
        
        // Navigation
        backToSubjects.addEventListener('click', function() {
            showPage(subjectsPage);
        });
        
        backToQuestions.addEventListener('click', function() {
            showPage(questionsPage);
        });
        
        // File upload
        uploadArea.addEventListener('click', function() {
            fileInput.click();
        });
        
        fileInput.addEventListener('change', handleFileSelect);
        
        // Submit button
        submitBtn.addEventListener('click', handleSubmission);
        
        // Success modal
        successOkBtn.addEventListener('click', function() {
            successModal.classList.add('hidden');
            showPage(questionsPage);
            resetUploadPage();
        });
        
        // Registration link
        registerLink.addEventListener('click', function(e) {
            e.preventDefault();
            showRegistrationForm();
        });
    }
    
    // Handle login
    async function handleLogin() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        
        if (!username || !password) {
            alert('Please enter both username and password');
            return;
        }
        
        // In a real app, this would be an API call
        currentUser = {
            id: 'user123',
            studentId: username,
            name: 'Test Student'
        };
        
        showPage(subjectsPage);
    }
    
    // Handle logout
    function handleLogout() {
        currentUser = null;
        localStorage.removeItem('currentUser');
        showPage(loginPage);
    }
    
    // Show registration form
    function showRegistrationForm() {
        loginForm.innerHTML = `
            <div class="input-group">
                <label for="regUsername">Username</label>
                <input type="text" id="regUsername" placeholder="Choose a username" required>
            </div>
            <div class="input-group">
                <label for="regPassword">Password</label>
                <input type="password" id="regPassword" placeholder="Create a password" required>
            </div>
            <div class="input-group">
                <label for="regStudentId">Student ID</label>
                <input type="text" id="regStudentId" placeholder="Your student ID">
            </div>
            <div class="input-group">
                <label for="regFullName">Full Name</label>
                <input type="text" id="regFullName" placeholder="Your full name">
            </div>
            <button type="button" id="registerBtn" class="btn-primary">
                <i class="fas fa-user-plus"></i> Register
            </button>
            <button type="button" id="backToLogin" class="btn-secondary">
                <i class="fas fa-arrow-left"></i> Back to Login
            </button>
        `;
        
        document.getElementById('registerBtn').addEventListener('click', handleRegister);
        document.getElementById('backToLogin').addEventListener('click', () => {
            loginForm.innerHTML = `
                <div class="input-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" placeholder="Enter your username" required>
                </div>
                <div class="input-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" placeholder="Enter your password" required>
                </div>
                <button type="submit" class="btn-primary">
                    <i class="fas fa-sign-in-alt"></i> Login
                </button>
            `;
            setupEventListeners();
        });
    }
    
    // Handle registration
    async function handleRegister() {
        const username = document.getElementById('regUsername').value.trim();
        const password = document.getElementById('regPassword').value.trim();
        const studentId = document.getElementById('regStudentId').value.trim();
        const fullName = document.getElementById('regFullName').value.trim();
        
        if (!username || !password) {
            alert('Username and password are required');
            return;
        }
        
        try {
            // In a real app, this would be an API call
            currentUser = {
                id: 'user456',
                studentId: studentId || "S" + Math.floor(1000 + Math.random() * 9000),
                name: fullName || username
            };
            
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            showPage(subjectsPage);
        } catch (error) {
            console.error("Registration failed:", error);
            alert('Registration failed. Please try again.');
        }
    }
    
    // Render subjects list
    function renderSubjects() {
        subjectList.innerHTML = '';
        
        mockSubjects.forEach(subject => {
            const subjectCard = document.createElement('div');
            subjectCard.className = 'subject-card';
            subjectCard.innerHTML = `
                <div class="subject-icon">
                    <i class="${subject.icon}"></i>
                </div>
                <div class="subject-info">
                    <div class="subject-name">${subject.name}</div>
                    <div class="subject-code">${subject.code}</div>
                </div>
                <i class="fas fa-chevron-right"></i>
            `;
            
            subjectCard.addEventListener('click', function() {
                selectSubject(subject);
            });
            
            subjectList.appendChild(subjectCard);
        });
    }
    
    // Select subject and show questions page
    function selectSubject(subject) {
        selectedSubject = subject;
        questionsPageTitle.textContent = `${subject.name} Questions`;
        renderQuestions(subject.questions);
        showPage(questionsPage);
    }
    
    // Render questions list
    function renderQuestions(questions) {
        questionList.innerHTML = '';
        
        questions.forEach(question => {
            const questionCard = document.createElement('div');
            questionCard.className = 'question-card';
            questionCard.innerHTML = `
                <div class="question-icon">
                    <i class="fas fa-question-circle"></i>
                </div>
                <div class="question-info">
                    <div class="question-number">${question.number}</div>
                    <div class="question-text">${question.text}</div>
                </div>
                <i class="fas fa-chevron-right"></i>
            `;
            
            questionCard.addEventListener('click', function() {
                selectQuestion(question);
            });
            
            questionList.appendChild(questionCard);
        });
    }
    
    // Select question and show upload page
    function selectQuestion(question) {
        selectedQuestion = question;
        uploadPageTitle.textContent = `Upload Answer for ${selectedSubject.code} ${question.number}`;
        
        // Display question info
        questionInfo.innerHTML = `
            <h3>${selectedSubject.code} - ${question.number}</h3>
            <p>${question.text}</p>
        `;
        
        // Check for existing submissions
        checkExistingSubmission();
        
        showPage(uploadPage);
    }
    
    // Check for existing submission
    async function checkExistingSubmission() {
        if (!currentUser || !selectedSubject || !selectedQuestion) {
            existingSubmission.classList.add('hidden');
            return;
        }
        
        try {
            // In a real app, this would be an API call
            // For demo, we'll use localStorage
            const submissions = JSON.parse(localStorage.getItem('submissions')) || {};
            const submissionKey = `${currentUser.studentId}_${selectedSubject.code}_${selectedQuestion.number}`;
            
            if (submissions[submissionKey]) {
                existingSubmission.classList.remove('hidden');
                previousSubmission.innerHTML = `
                    <img src="${submissions[submissionKey].url}" alt="Previous submission">
                    <p>Submitted: ${new Date(submissions[submissionKey].date).toLocaleString()}</p>
                `;
            } else {
                existingSubmission.classList.add('hidden');
            }
        } catch (error) {
            console.error("Error checking submissions:", error);
            existingSubmission.classList.add('hidden');
        }
    }
    
    // Handle file selection
    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        if (!file.type.match('image.*')) {
            alert('Please select an image file (JPEG, PNG, etc.)');
            return;
        }
        
        selectedFile = file;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            previewArea.innerHTML = '';
            const img = document.createElement('img');
            img.src = e.target.result;
            previewArea.appendChild(img);
            submitBtn.disabled = false;
        };
        reader.readAsDataURL(file);
    }
    
    async function handleSubmission() {
        if (!selectedFile) return;
    
        processingModal.classList.remove('hidden');
    
        try {
            const formData = new FormData();
            formData.append('prn', currentUser.studentId);
            formData.append('subject_code', mockSubjects[0]['code']);
            formData.append('question_no', parseInt(selectedQuestion.number.replace(/\D/g, ''))); 
            formData.append('file', selectedFile);
    
            const response = await fetch(`http://0.0.0.0:8000/upload`, {
                method: 'POST',
                body: formData
            });
            
    
            // if (!response.ok) {
            //     throw new Error('Submission failed');
            // }
    
            // const result = await response.json();
            console.log("Upload successful:");
            // successModal.classList.remove('hidden');
            showPage(questionsPage);
    
        } catch (error) {
            console.error("Upload failed:", error);
            // alert('Failed to save image. Please try again.');
        } finally {
            processingModal.classList.add('hidden');
        }
    }
        
    // Add this to your DOM Elements section at the top
    const getScoreBtn = document.getElementById('getScoreBtn');

    // Add this to your setupEventListeners function
    getScoreBtn.addEventListener('click', handleGetScores);

    // Add this new function to handle getting scores
    async function handleGetScores() {
        if (!currentUser || !selectedSubject) {
            alert('Please select a subject first');
            return;
        }

        try {
            processingModal.classList.remove('hidden');

            const formData = new FormData();
            formData.append('prn', currentUser.studentId);
            formData.append('subject_code', selectedSubject.code);
            
            // Make API call to get scores
            const response = await fetch(`http://0.0.0.0:8010/ocr`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const scoresData = await response.json();
            const total_score = scoresData['total_score'];
            console.log(scoresData['total_score'])
            processingModal.classList.add('hidden');

            // if (!scoresData || scoresData.length === 0) {
            //     alert('No scores found for this subject');
            //     return;
            // }

            // Create and show scores modal
            const scoresModal = document.createElement('div');
            scoresModal.className = 'modal';
            scoresModal.innerHTML = `
                <div class="modal-content">
                    <h2>Your Scores for ${selectedSubject.name}</h2>
                    <div class="total-score">Total Score: ${total_score}</div>
                    <button id="closeScoresModal" class="btn-primary">Close</button>
                </div>
            `;
            
            document.body.appendChild(scoresModal);
            
            document.getElementById('closeScoresModal').addEventListener('click', () => {
                document.body.removeChild(scoresModal);
            });
            
        } catch (error) {
            processingModal.classList.add('hidden');
            console.error("Error getting scores:", error);
            alert('Failed to get scores. Please try again.');
        }
    }
    
    // Reset upload page
    function resetUploadPage() {
        selectedFile = null;
        fileInput.value = '';
        previewArea.innerHTML = '<p>No image selected</p>';
        submitBtn.disabled = true;
        existingSubmission.classList.add('hidden');
    }
    
    // Show specific page and hide others
    function showPage(page) {
        document.querySelectorAll('.page').forEach(p => {
            p.classList.add('hidden');
        });
        page.classList.remove('hidden');
    }
    
    // Initialize the application
    init();
});