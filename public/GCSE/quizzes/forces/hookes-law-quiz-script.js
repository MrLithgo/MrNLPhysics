document.addEventListener('DOMContentLoaded', function() {
    const questions = [
        {
            question: "What is the aim of this Hooke's Law experiment?",
            options: [
                "To measure the mass of different springs",
                "To investigate the relationship between force and extension for a spring/rubber band",
                "To calculate the gravitational field strength of Earth",
                "To determine the density of rubber bands"
            ],
            correctAnswer: 1,
            explanation: "The aim is to study how force (F) and extension (e) are related for elastic materials."
        },
        {
            question: "What is the independent variable in this experiment?",
            options: [
                "Extension of the spring",
                "Force applied (weight of masses)",
                "Type of material (spring vs rubber band)",
                "Original length of the spring"
            ],
            correctAnswer: 1,
            explanation: "The independent variable is the force (F), deliberately changed by adding masses."
        },
        {
            question: "How is the force (F) calculated in this experiment?",
            options: [
                "F = mass × extension",
                "F = mass × gravitational field strength (g)",
                "F = spring constant × extension",
                "F = original length × mass"
            ],
            correctAnswer: 1,
            explanation: "Force is calculated as weight: F = m × g (where g ≈ 10 N/kg on Earth)."
        },
        {
            question: "Why must measurements be taken at eye level with the ruler?",
            options: [
                "To ensure the spring is vertical",
                "To avoid parallax error",
                "To reduce random errors in mass measurements",
                "To make the experiment faster"
            ],
            correctAnswer: 1,
            explanation: "Eye-level measurements prevent parallax error, a systematic error in reading scales."
        },
        {
            question: "What safety precaution is essential for this experiment?",
            options: [
                "Using a plastic ruler",
                "Wearing safety glasses",
                "Adding masses quickly",
                "Ignoring small extensions"
            ],
            correctAnswer: 1,
            explanation: "Safety glasses protect against snapping springs or flying masses."
        },
        {
            question: "What does the gradient of a force-extension graph represent for a spring?",
            options: [
                "The spring's original length",
                "The spring constant (k)",
                "The limit of proportionality",
                "The gravitational field strength"
            ],
            correctAnswer: 1,
            explanation: "The gradient (ΔF/Δe) gives the spring constant (k), a measure of stiffness."
        },
        {
            question: "Why is a rubber band's extension measured during both loading and unloading?",
            options: [
                "To save time",
                "Rubber bands behave differently under loading/unloading due to hysteresis",
                "To reduce systematic errors",
                "Because rubber bands don't extend"
            ],
            correctAnswer: 1,
            explanation: "Rubber exhibits hysteresis—its extension path differs when loaded vs unloaded."
        },
        {
            question: "What indicates a spring has exceeded its limit of proportionality?",
            options: [
                "The graph becomes steeper",
                "The graph curves (no longer linear)",
                "The spring stops extending",
                "The masses fall off"
            ],
            correctAnswer: 1,
            explanation: "A curved graph beyond the linear region means the spring is permanently deformed."
        },
        {
            question: "How can random errors be reduced in this experiment?",
            options: [
                "Using a fiducial marker (pointer)",
                "Adding masses rapidly",
                "Ignoring small extensions",
                "Using a shorter ruler"
            ],
            correctAnswer: 0,
            explanation: "A fiducial marker (e.g., a pointer) improves measurement accuracy."
        },
        {
            question: "What control variable ensures valid results?",
            options: [
                "Changing the spring halfway",
                "Using the same spring/rubber band throughout",
                "Varying gravitational field strength",
                "Measuring extension at an angle"
            ],
            correctAnswer: 1,
            explanation: "Using the same material controls stiffness, ensuring force-extension changes are valid."
        }
    ];

  let currentQuestion = 0;
  let score = 0;
  let userAnswers = [];

  const quizContent = document.getElementById('quiz-content');
  const questionNumberEl = document.getElementById('question-number');
  const progressBarEl = document.getElementById('progress-bar');
  const scoreDisplayEl = document.getElementById('score-display');

  function displayQuestion() {
    const q = questions[currentQuestion];

    questionNumberEl.textContent = `Question ${currentQuestion + 1}/${questions.length}`;
    progressBarEl.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;

    let optionsHTML = '';
    q.options.forEach((opt, idx) => {
      optionsHTML += `
        <div class="option-item">
          <label class="option-label" data-index="${idx}">
            <input type="radio" name="answer" value="${idx}">
            <span class="option-text">${opt}</span>
          </label>
        </div>
      `;
    });

    quizContent.innerHTML = `
      <div class="question-block">
        <div class="question-title">${q.question}</div>
        <form id="quiz-form">
          <div class="options">${optionsHTML}</div>
          <div style="margin-top:14px;">
            <button type="submit" id="submit-btn" class="btn btn-primary" aria-label="Submit answer">Submit Answer</button>
          </div>
        </form>
      </div>
      <div id="feedback" class="feedback hidden"></div>
    `;

    const form = document.getElementById('quiz-form');
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      submitAnswer();
    });
  }

  function submitAnswer() {
    const selected = document.querySelector('input[name="answer"]:checked');

    if (!selected) {
      alert('Please select an answer!');
      return;
    }

    const answer = parseInt(selected.value, 10);
    const correct = answer === questions[currentQuestion].correctAnswer;

    if (correct) {
      score++;
      scoreDisplayEl.textContent = `Score: ${score}`;
    }

    userAnswers.push({
      question: currentQuestion,
      userAnswer: answer,
      correct: correct
    });

    // Show feedback
    const feedbackDiv = document.getElementById('feedback');
    feedbackDiv.classList.remove('hidden');
    feedbackDiv.className = 'feedback ' + (correct ? 'correct' : 'incorrect');

    // icon SVGs
    const icon = correct ? '<svg class="icon" viewBox="0 0 20 20"><path fill="currentColor" d="M7.4 13.4L4 10l1.4-1.4L7.4 10.6 14.6 3.4 16 4.8z"></path></svg>' :
                          '<svg class="icon" viewBox="0 0 20 20"><path fill="currentColor" d="M10 8.6l3.2-3.2 1.4 1.4L11.4 10l3.2 3.2-1.4 1.4L10 11.4l-3.2 3.2-1.4-1.4L8.6 10 5.4 6.8 6.8 5.4 10 8.6z"></path></svg>';

    feedbackDiv.innerHTML = `
      <div style="display:flex;align-items:flex-start;gap:10px;">
        <div style="flex-shrink:0;">${icon}</div>
        <div>
          <p style="margin:0 0 6px;font-weight:600;">${correct ? 'Correct!' : 'Incorrect!'}</p>
          <p style="margin:0;font-size:14px;">${questions[currentQuestion].explanation}</p>
        </div>
      </div>
      <div style="margin-top:12px;">
        <button id="next-btn" class="btn btn-primary">${currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}</button>
      </div>
    `;

    // disable options
    const options = document.querySelectorAll('input[name="answer"]');
    options.forEach(opt => opt.disabled = true);

    // highlight correct and wrong
    const labels = document.querySelectorAll('.option-label');
    labels.forEach((label, idx) => {
      if (idx === questions[currentQuestion].correctAnswer) {
        label.classList.add('correct-answer');
      } else if (idx === answer && !correct) {
        label.classList.add('wrong-answer');
      }
    });

    const submitBtn = document.getElementById('submit-btn');
    if (submitBtn) submitBtn.disabled = true;

    document.getElementById('next-btn').addEventListener('click', nextQuestion);
  }

  function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < questions.length) {
      displayQuestion();
    } else {
      showResults();
    }
  }

  function showResults() {
    document.getElementById('quiz-content').classList.add('hidden');
    const resultsEl = document.getElementById('results');
    resultsEl.classList.remove('hidden');

    // allow CSS transition to apply
    setTimeout(() => resultsEl.classList.add('show'), 50);

    document.getElementById('final-score').textContent = score;
    document.getElementById('correct-count').textContent = score;
    document.getElementById('final-progress').style.width = `${(score / questions.length) * 100}%`;

    const resultMessage = document.getElementById('result-message');
    if (score === 10) {
      resultMessage.textContent = "Perfect! You're a Hooke's Law hero!";
    } else if (score >= 8) {
      resultMessage.textContent = "Excellent! You understand Hooke's Law well.";
    } else if (score >= 6) {
      resultMessage.textContent = "Good job! You know most key concepts about Hooke's Law.";
    } else if (score >= 4) {
      resultMessage.textContent = "You're learning - review what Hooke's Law is.";
    } else {
      resultMessage.textContent = "Revise the basics of Hooke's Law and try again!";
    }

    // review list
    const reviewList = document.getElementById('review-list');
    reviewList.innerHTML = '';
    userAnswers.forEach((ans, i) => {
      const question = questions[ans.question];
      const correctClass = ans.correct ? 'correct' : 'incorrect';
      const correctAnswerText = question.options[question.correctAnswer];
      const userAnswerText = question.options[ans.userAnswer];

      const item = document.createElement('div');
      item.className = `review-item ${correctClass}`;
      item.innerHTML = `
        <p style="margin:0 0 6px;font-weight:600;">Question ${i + 1}: ${question.question}</p>
        <p style="margin:0 0 4px;"><strong>Your answer:</strong> ${userAnswerText}</p>
        ${ans.correct ? '' : `<p style="margin:0;"><strong>Correct answer:</strong> ${correctAnswerText}</p>`}
      `;
      reviewList.appendChild(item);
    });

    document.getElementById('restart-btn').addEventListener('click', restartQuiz);
  }

  function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    userAnswers = [];
    scoreDisplayEl.textContent = 'Score: 0';
    const resultsEl = document.getElementById('results');
    resultsEl.classList.remove('show');
    // hide then re-display question
    setTimeout(() => {
      resultsEl.classList.add('hidden');
      document.getElementById('quiz-content').classList.remove('hidden');
      displayQuestion();
    }, 300);
  }

  // start
  displayQuestion();
});
