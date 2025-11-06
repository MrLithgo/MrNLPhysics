document.addEventListener('DOMContentLoaded', function() {
    const questions = [
    {
        question: "What is the principle of moments?",
        options: [
            "The total upward forces equal the total downward forces",
            "When an object is in equilibrium, the total clockwise moments equal the total anticlockwise moments",
            "Force equals mass times acceleration",
            "Energy cannot be created or destroyed"
        ],
        correctAnswer: 1,
        explanation: "At equilibrium, the sum of clockwise moments equals the sum of anticlockwise moments."
    },
    {
        question: "What is the moment of a force measured in?",
        options: [
            "Newtons (N)",
            "Newtons per metre (N/m)",
            "Newton-metres (N m)",
            "Joules per second (J/s)"
        ],
        correctAnswer: 2,
        explanation: "Moment = Force × Perpendicular distance, so the units are newton-metres (N m)."
    },
    {
        question: "Which change will double the moment of a force?",
        options: [
            "Halving the distance from the pivot",
            "Doubling the distance from the pivot",
            "Keeping both force and distance constant",
            "Reducing the force by half"
        ],
        correctAnswer: 1,
        explanation: "Moment increases proportionally with distance; doubling the distance doubles the moment."
    },
    {
        question: "A 10 N force acts 0.3 m from a pivot. What is the moment?",
        options: [
            "3.3 N m",
            "30 N m",
            "3.0 N m",
            "0.03 N m"
        ],
        correctAnswer: 2,
        explanation: "Moment = 10 N × 0.3 m = 3.0 N m."
    },
    {
        question: "For a uniform beam balanced on a pivot, what can be said about the moments?",
        options: [
            "They are unequal, causing rotation",
            "The anticlockwise moment is greater than the clockwise moment",
            "The clockwise and anticlockwise moments are equal",
            "There are no moments acting at all"
        ],
        correctAnswer: 2,
        explanation: "If the beam is balanced, clockwise and anticlockwise moments must be equal."
    },
    {
        question: "A 5 N weight is 0.4 m from the pivot. To balance it, a second weight is placed 0.2 m on the other side. What must that weight be?",
        options: [
            "5 N",
            "2.5 N",
            "10 N",
            "1 N"
        ],
        correctAnswer: 2,
        explanation: "Moments must balance: 5 × 0.4 = W × 0.2, so W = 10 N."
    },
    {
        question: "Why are spanners made with long handles?",
        options: [
            "To make them lighter",
            "To reduce friction",
            "To increase the distance from the pivot",
            "To make them look better"
        ],
        correctAnswer: 2,
        explanation: "A longer handle increases the perpendicular distance from the pivot, giving a greater turning effect for the same force."
    },
    {
        question: "If a door is pushed near the hinges instead of at the handle, what happens to the turning effect?",
        options: [
            "It increases",
            "It decreases",
            "It stays the same",
            "It becomes zero"
        ],
        correctAnswer: 1,
        explanation: "The shorter distance reduces the moment, so the turning effect decreases."
    },
    {
                question: "If you balance a ruler on your finger, what is your finger acting as?",
        options: [
            "A force",
            "A pivot",
            "A lever",
            "A counterweight"
        ],
        correctAnswer: 1,
        explanation: "Your finger is the pivot about which the ruler turns."
    },
    {
        question: "In a wheelbarrow, where is the pivot?",
        options: [
            "At the wheel",
            "At the handles",
            "At the load",
            "At the centre of mass"
        ],
        correctAnswer: 0,
        explanation: "The wheel acts as the pivot about which the wheelbarrow turns."
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
      resultMessage.textContent = "Perfect! You're a moments master!";
    } else if (score >= 8) {
      resultMessage.textContent = "Excellent! You understand moments well.";
    } else if (score >= 6) {
      resultMessage.textContent = "Good job! You know most key concepts about turning forces.";
    } else if (score >= 4) {
      resultMessage.textContent = "You're learning - review what moments are.";
    } else {
      resultMessage.textContent = "Revise the basics of moments and turning forces and try again!";
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
