document.addEventListener('DOMContentLoaded', function() {
  const questions = [
        {
            question: "What is the correct equation for momentum?",
            options: [
                "momentum = mass × acceleration",
                "momentum = mass × velocity",
                "momentum = force × time",
                "momentum = energy × velocity"
            ],
            correctAnswer: 1,
            explanation: "Momentum (p) = mass (m) × velocity (v). The SI unit is kg m/s."
        },
        {
            question: "A 5 kg object moves at 2 m/s. What is its momentum?",
            options: [
                "2.5 kg m/s",
                "7 kg m/s",
                "10 kg m/s",
                "20 kg m/s"
            ],
            correctAnswer: 2,
            explanation: "p = m × v = 5 kg × 2 m/s = <strong>10 kg m/s</strong>."
        },
        {
            question: "What is conserved in a closed system with no external forces?",
            options: [
                "Only kinetic energy",
                "Only velocity",
                "Total momentum",
                "Mass and acceleration"
            ],
            correctAnswer: 2,
            explanation: "The <strong>law of conservation of momentum</strong> states total momentum remains constant in closed systems."
        },
        {
            question: "A car crashes into a wall. How does its momentum change?",
            options: [
                "Increases",
                "Decreases to zero",
                "Stays the same",
                "Changes direction but not magnitude"
            ],
            correctAnswer: 1,
            explanation: "The car stops (v = 0), so momentum decreases to zero (though total system momentum is conserved)."
        },
        {
            question: "What is the momentum of a stationary object?",
            options: [
                "Equal to its mass",
                "Zero",
                "Depends on its potential energy",
                "Infinite"
            ],
            correctAnswer: 1,
            explanation: "If velocity = 0, momentum = 0 (since p = m × 0)."
        },
        {
            question: "How does increasing velocity affect momentum?",
            options: [
                "No effect",
                "Momentum decreases proportionally",
                "Momentum increases proportionally",
                "Momentum increases exponentially"
            ],
            correctAnswer: 2,
            explanation: "Momentum is directly proportional to velocity (p = mv)."
        },
        {
            question: "Two ice skaters push off each other. What happens to their total momentum?",
            options: [
                "It doubles",
                "It becomes zero",
                "It remains zero (if initially stationary)",
                "It depends on their masses"
            ],
            correctAnswer: 2,
            explanation: "Total momentum is conserved. If initially stationary, total p = 0 before and after because momentum is a vector; one skater will have equal but opposite momentum to the other."
        },
        {
            question: "What is the unit of momentum?",
            options: [
                "Newtons (N)",
                "Joules (J)",
                "Kilograms (kg)",
                "Kilogram metres per second (kg m/s)"
            ],
            correctAnswer: 3,
            explanation: "Momentum = mass × velocity → units = kg × m/s = <strong>kg m/s</strong>."
        },
        {
            question: "A truck and a bicycle have the same momentum. Which has greater velocity?",
            options: [
                "The truck",
                "The bicycle",
                "Both have the same velocity",
                "Cannot determine"
            ],
            correctAnswer: 1,
            explanation: "Since p = mv, the bicycle (smaller mass) must have higher velocity for equal momentum."
        },
        {
            question: "What defines an elastic collision?",
            options: [
                "Momentum is conserved",
                "Momentum is not conserved",
                "Kinetic energy is conserved",
                "Potential energy is conserved"
            ],
            correctAnswer: 2,
            explanation: "Momentum is conserved in all collisions but kinetic energy is also conserved in a perfectly elastic collision"
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
      resultMessage.textContent = "Perfect! You're a collisions expert!";
    } else if (score >= 8) {
      resultMessage.textContent = "Excellent! You understand momentum well.";
    } else if (score >= 6) {
      resultMessage.textContent = "Good job! You know most key concepts about momentum.";
    } else if (score >= 4) {
      resultMessage.textContent = "You're learning - review how to calculate momentum.";
    } else {
      resultMessage.textContent = "Revise the basics of momentum and try again!";
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
