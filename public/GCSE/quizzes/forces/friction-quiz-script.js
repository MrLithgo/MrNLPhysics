document.addEventListener('DOMContentLoaded', function() {
   const questions = [
        {
            question: "What is friction?",
            options: [
                "A force that opposes motion between two surfaces in contact.",
                "A type of energy that helps objects move faster.",
                "A magnetic force between two objects.",
                "The absence of any resistance when objects move."
            ],
            correctAnswer: 0,
            explanation: "Friction is a force that opposes the relative motion between two surfaces in contact."
        },
        {
            question: "Which type of friction occurs when an object slides over a surface?",
            options: [
                "Static friction",
                "Rolling friction",
                "Sliding (kinetic) friction",
                "Fluid friction"
            ],
            correctAnswer: 2,
            explanation: "Sliding (or kinetic) friction acts when two surfaces slide against each other."
        },
        {
            question: "Which of the following reduces friction?",
            options: [
                "Making surfaces rougher",
                "Adding lubricants like oil or grease",
                "Increasing the weight of the object",
                "Pressing surfaces together more firmly"
            ],
            correctAnswer: 1,
            explanation: "Lubricants reduce friction by creating a slippery layer between surfaces."
        },
        {
            question: "Static friction is generally ______ kinetic friction.",
            options: [
                "less than",
                "equal to",
                "greater than",
                "unrelated to"
            ],
            correctAnswer: 2,
            explanation: "Static friction is usually stronger than kinetic friction because it takes more force to start moving an object than to keep it moving."
        },
        {
            question: "Which of these is an example of fluid friction?",
            options: [
                "A car's tires gripping the road",
                "A hockey puck sliding on ice",
                "A parachute slowing down a skydiver",
                "A ball rolling down a hill"
            ],
            correctAnswer: 2,
            explanation: "Fluid friction occurs when an object moves through a fluid (like air or water), such as a parachute in air."
        },
        {
            question: "What happens to friction if the weight of an object increases?",
            options: [
                "Friction decreases",
                "Friction remains the same",
                "Friction increases",
                "Friction becomes zero"
            ],
            correctAnswer: 2,
            explanation: "Friction increases with weight because the normal force (and thus the contact between surfaces) increases."
        },
        {
            question: "Which of these surfaces would likely produce the least friction?",
            options: [
                "Sandpaper",
                "Wet ice",
                "Carpet",
                "Rubber mat"
            ],
            correctAnswer: 1,
            explanation: "Wet ice is very slippery, resulting in minimal friction."
        },
        {
            question: "Why do shoes have treads (grooves) on their soles?",
            options: [
                "To reduce friction",
                "To increase friction for better grip",
                "To make them look stylish",
                "To make them lighter"
            ],
            correctAnswer: 1,
            explanation: "Treads increase friction by creating more surface area and channels to displace water or debris."
        },
        {
            question: "Which force helps us walk without slipping?",
            options: [
                "Gravity",
                "Static friction",
                "Magnetic force",
                "Air resistance"
            ],
            correctAnswer: 1,
            explanation: "Static friction between our feet and the ground prevents slipping while walking."
        },
        {
            question: "Friction can sometimes be useful because it:",
            options: [
                "Wears out machine parts",
                "Helps in writing with a pencil",
                "Makes movement smoother without any resistance",
                "Causes overheating in engines"
            ],
            correctAnswer: 1,
            explanation: "Friction between the pencil tip and paper allows us to write."
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
      resultMessage.textContent = "Perfect! You're a friction expert!";
    } else if (score >= 8) {
      resultMessage.textContent = "Excellent! You understand friction well.";
    } else if (score >= 6) {
      resultMessage.textContent = "Good job! You know most key concepts about friction.";
    } else if (score >= 4) {
      resultMessage.textContent = "You're learning - review what friction is.";
    } else {
      resultMessage.textContent = "Revise the basics of friction and try again!";
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
