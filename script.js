document.addEventListener('DOMContentLoaded', () => {
    
    // --- MASUKKAN DATA SOAL LENGKAP ANDA DI SINI ---
    const quizData = [
        {
            tag: "Bab 1: Part of Speech",
            question: "Which of the following words functions as an abstract noun in nursing context?",
            options: [
                { text: "Stethoscope", isCorrect: false, rationale: "Stethoscope is a concrete noun because it can be physically touched and seen." },
                { text: "Pain", isCorrect: true, rationale: "Pain is an abstract noun representing an idea, feeling, or sensation that cannot be physically touched." },
                { text: "Hospital", isCorrect: false, rationale: "Hospital is a concrete noun representing a physical place or building." },
                { text: "Syringe", isCorrect: false, rationale: "Syringe is a concrete medical instrument." }
            ],
            hint: "Pikirkan kata benda yang menyatakan konsep atau sensasi yang tidak berwujud fisik."
        },
        {
            tag: "Bab 2: Admission to Hospital",
            question: "What is an 'Emergency Admission' in a hospital setting?",
            options: [
                { text: "A planned hospital stay scheduled weeks in advance", isCorrect: false, rationale: "This describes an arranged admission." },
                { text: "Admission resulting from sudden illness or accident needing immediate care", isCorrect: true, rationale: "Emergency admissions occur unexpectedly due to critical conditions like trauma or acute illness." },
                { text: "Routine outpatient check-up", isCorrect: false, rationale: "Outpatient check-ups do not involve hospital admission." },
                { text: "Elective cosmetic surgery", isCorrect: false, rationale: "Cosmetic surgery is planned." }
            ],
            hint: "Masuk rumah sakit karena kondisi mendadak seperti kecelakaan."
        }
        // ... (PASTE SISA 58 SOAL ANDA DI SINI) ...
    ];

    // State Variables
    let currentQuestionIndex = 0;
    let score = 0;
    let selectedOption = null;
    let timerInterval = null;
    let secondsElapsed = 0;

    // Elements
    const welcomeScreen = document.getElementById('welcome-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const resultScreen = document.getElementById('result-screen');
    
    const questionTag = document.getElementById('question-tag');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const progressIndicator = document.getElementById('progress-indicator');
    const progressBar = document.getElementById('progress-bar');
    
    const hintBox = document.getElementById('hint-box');
    const hintText = document.getElementById('hint-text');
    
    const finalScore = document.getElementById('final-score');
    const timerDisplay = document.getElementById('timer');

    // Buttons Element
    const startBtn = document.getElementById('start-btn');
    const hintBtn = document.getElementById('hint-btn');
    const nextBtn = document.getElementById('next-btn');
    const restartBtn = document.getElementById('restart-btn');

    // Event Listeners untuk Tombol
    startBtn.addEventListener('click', startQuiz);
    hintBtn.addEventListener('click', toggleHint);
    nextBtn.addEventListener('click', nextQuestion);
    restartBtn.addEventListener('click', restartQuiz);

    // Functions
    function startQuiz() {
        welcomeScreen.classList.add('hidden');
        resultScreen.classList.add('hidden');
        quizScreen.classList.remove('hidden');
        
        currentQuestionIndex = 0;
        score = 0;
        secondsElapsed = 0;
        
        startTimer();
        loadQuestion();
    }

    function startTimer() {
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            secondsElapsed++;
            let mins = Math.floor(secondsElapsed / 60).toString().padStart(2, '0');
            let secs = (secondsElapsed % 60).toString().padStart(2, '0');
            timerDisplay.innerText = `⏱️ ${mins}:${secs}`;
        }, 1000);
    }

    function loadQuestion() {
        selectedOption = null; 
        nextBtn.disabled = true; 
        hintBox.classList.add('hidden'); 
        
        const oldRationale = document.getElementById('rationale-box');
        if(oldRationale) oldRationale.remove();

        const totalQ = quizData.length;
        const currentQ = quizData[currentQuestionIndex];
        
        questionTag.innerText = currentQ.tag;
        questionText.innerText = currentQ.question;
        hintText.innerText = currentQ.hint;
        progressIndicator.innerText = `Soal ${currentQuestionIndex + 1} / ${totalQ}`;
        
        const progressPercentage = ((currentQuestionIndex) / totalQ) * 100;
        progressBar.style.width = `${progressPercentage}%`;

        if (currentQuestionIndex === totalQ - 1) {
            nextBtn.innerText = "Selesai";
        } else {
            nextBtn.innerText = "Selanjutnya";
        }

        optionsContainer.innerHTML = '';
        currentQ.options.forEach((opt, index) => {
            const btn = document.createElement('button');
            btn.className = 'w-full text-left p-4 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50 transition duration-200 font-medium text-slate-700 bg-white mb-3 relative flex items-center justify-between group cursor-pointer';
            
            const textSpan = document.createElement('span');
            textSpan.innerText = opt.text;
            textSpan.className = "pr-6";
            
            const iconSpan = document.createElement('span');
            iconSpan.className = "text-xl absolute right-4 opacity-0 transition-opacity duration-200";
            
            btn.appendChild(textSpan);
            btn.appendChild(iconSpan);
            
            // Tambahkan event listener untuk memproses pilihan
            btn.addEventListener('click', () => selectOption(opt, btn, currentQ.options, iconSpan));
            
            optionsContainer.appendChild(btn);
        });
    }

    function selectOption(selectedOpt, btnElement, allOptions, selectedIconSpan) {
        if (selectedOption !== null) return;
        selectedOption = selectedOpt;
        
        const isCorrect = selectedOpt.isCorrect;
        if (isCorrect) score++;

        const buttons = optionsContainer.querySelectorAll('button');
        
        buttons.forEach((btn, idx) => {
            btn.disabled = true; 
            btn.classList.remove('hover:border-teal-500', 'hover:bg-teal-50', 'cursor-pointer'); 
            
            const icon = btn.querySelector('span:last-child');
            icon.classList.remove('opacity-0');

            if (allOptions[idx].isCorrect) {
                btn.classList.add('bg-emerald-50', 'border-emerald-500', 'text-emerald-800');
                btn.classList.remove('border-slate-200', 'text-slate-700');
                icon.innerText = '✅';
            } else if (btn === btnElement && !isCorrect) {
                btn.classList.add('bg-rose-50', 'border-rose-500', 'text-rose-800');
                btn.classList.remove('border-slate-200', 'text-slate-700');
                icon.innerText = '❌';
            } else {
                btn.classList.add('opacity-50');
            }
        });

        // Tampilkan Box Feedback/Rationale
        const rationaleDiv = document.createElement('div');
        rationaleDiv.id = 'rationale-box';
        rationaleDiv.className = `mt-4 p-4 rounded-xl text-sm border shadow-sm animate-fade-in ${
            isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
        }`;
        rationaleDiv.innerHTML = `
            <div class="font-bold mb-1 ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}">
                ${isCorrect ? '🎉 Benar!' : '💡 Kurang Tepat.'}
            </div>
            <div>${selectedOpt.rationale}</div>
        `;
        optionsContainer.appendChild(rationaleDiv);

        nextBtn.disabled = false;
    }

    function toggleHint() {
        if (hintBox.classList.contains('hidden')) {
            hintBox.classList.remove('hidden');
        } else {
            hintBox.classList.add('hidden');
        }
    }

    function nextQuestion() {
        currentQuestionIndex++;
        if (currentQuestionIndex < quizData.length) {
            loadQuestion();
        } else {
            showResult();
        }
    }

    function showResult() {
        clearInterval(timerInterval); 
        quizScreen.classList.add('hidden');
        resultScreen.classList.remove('hidden');
        progressBar.style.width = `100%`;

        const totalQ = quizData.length;
        const percentage = Math.round((score / totalQ) * 100);

        finalScore.innerText = `${score} / ${totalQ}`;
        document.getElementById('percentage-score').innerText = `Nilai: ${percentage}%`;
        
        let mins = Math.floor(secondsElapsed / 60).toString().padStart(2, '0');
        let secs = (secondsElapsed % 60).toString().padStart(2, '0');
        document.getElementById('time-spent').innerText = `Diselesaikan dalam: ${mins} menit ${secs} detik`;

        const msgElement = document.getElementById('result-message');
        if (percentage >= 90) {
            msgElement.innerText = "Luar biasa! Pemahaman Anda tentang materi Keperawatan sangat solid.";
        } else if (percentage >= 70) {
            msgElement.innerText = "Kerja bagus! Anda sudah memahami sebagian besar materi dengan baik.";
        } else if (percentage >= 50) {
            msgElement.innerText = "Cukup baik, tapi masih ada beberapa konsep yang perlu diulang.";
        } else {
            msgElement.innerText = "Jangan menyerah! Silakan baca kembali modul materi dan coba lagi.";
        }
    }

    function restartQuiz() {
        startQuiz();
    }
});