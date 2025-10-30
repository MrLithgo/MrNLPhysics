document.addEventListener('DOMContentLoaded', function() {
  const questions = [
        {
            question: "Newton's Second Law states that:",
            options: [
                "An object at rest stays at rest",
                "Force equals mass times acceleration",
                "For every action there's an equal and opposite reaction",
                "Energy cannot be created or destroyed"
            ],
            correctAnswer: 1,
            explanation: "The correct answer is b) Force equals mass times acceleration"
        },
        {
            question: "In the cart experiment, if you double the force while keeping mass constant, what happens to acceleration?",
            options: [
                "Halves",
                "Stays the same",
                "Doubles",
                "Quadruples"
            ],
            correctAnswer: 2,
            explanation: "From F=ma, if F doubles and m stays the same, a must double."
        },
        {
            question: "A 1,500kg car accelerates at 3 m/s². What force is needed?",
            options: [
                "500N",
                "1,500N",
                "4,500N",
                "9,800N"
            ],
            correctAnswer: 2,
            explanation: "Calculation: F = ma = 1,500kg × 3m/s² = 4,500N"
        },
        {
            question: "In the experiment, what happens if you increase mass while keeping force constant?",
            options: [
                "Acceleration increases",
                "Acceleration decreases",
                "Velocity stays constant",
                "Time to finish decreases"
            ],
            correctAnswer: 1,
            explanation: "From a=F/m, increasing mass decreases acceleration."
        },
        {
            question: "A 50N force moves a 10kg box. What's its acceleration?",
            options: [
                "0.2 m/s²",
                "5 m/s²",
                "50 m/s²",
                "500 m/s²"
            ],
            correctAnswer: 1,
            explanation: "Calculation: a = F/m = 50N / 10kg = 5 m/s²"
        },
        {
            question: "Which real-world situation BEST demonstrates Newton's Second Law?",
            options: [
                "A book resting on a table",
                "A rocket launching",
                "A balloon sticking to a wall",
                "A boat floating on the sea"
            ],
            correctAnswer: 1,
            explanation: "Rocket launching clearly shows a force producing an acceleration"
        },
        {
            question: "In the experiment, a 0.5kg cart with 2N force takes 1.41s to finish. What's its theoretical acceleration?",
            options: [
                "1 m/s²",
                "2 m/s²",
                "4 m/s²",
                "8 m/s²"
            ],
            correctAnswer: 2,
            explanation: "Calculation: a = F/m = 2N/0.5kg = 4 m/s²"
        },
        {
            question: "A cyclist accelerates at 2 m/s² using 300N force. What's their mass?",
            options: [
                "60kg",
                "150kg",
                "300kg",
                "600kg"
            ],
            correctAnswer: 1,
            explanation: "Calculation: m = F / a = 300N / 2m/s² = 150kg. This includes the mass of both cyclist and bicycle."
        },
        {
            question: "If a cart crosses the 1m track in 2s with constant acceleration of 0.5 m/s², what's its final velocity?",
            options: [
                "0.5 m/s",
                "1 m/s",
                "2 m/s",
                "4 m/s"
            ],
            correctAnswer: 1,
            explanation: "Calculation: v = a x t = 0.5 × 2 = 1 m/s"
        },
        {
            question: "Why does a lorry need more force to accelerate than a motorcycle?",
            options: [
                "Air resistance",
                "Greater mass",
                "Tire friction",
                "Engine design"
            ],
            correctAnswer: 1,
            explanation: "Newton's Law Connection: a=F/m → Larger m requires larger F for same a"
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
      resultMessage.textContent = "Perfect! You're a Second Law expert!";
    } else if (score >= 8) {
      resultMessage.textContent = "Excellent! You understand force and acceleration well.";
    } else if (score >= 6) {
      resultMessage.textContent = "Good job! You know most key concepts about forces and acceleration.";
    } else if (score >= 4) {
      resultMessage.textContent = "You're learning - review how to use F=ma.";
    } else {
      resultMessage.textContent = "Revise the basics of force and acceleration and try again!";
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
