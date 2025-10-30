document.addEventListener('DOMContentLoaded', function() {
    const questions = [
    {
        question: "What is the aim of this experiment?",
        options: [
            "To find how the height of a ramp affects the speed of a trolley",
            "To calculate the kinetic energy of the trolley",
            "To measure the acceleration due to gravity",
            "To measure the force acting on the trolley"
        ],
        correctAnswer: 0,
        explanation: "The aim is to investigate how changing the ramp height affects the trolley’s average speed."
    },
    {
        question: "What is the independent variable in this experiment?",
        options: [
            "Average speed",
            "Average time",
            "Height of the ramp",
            "Distance between light gates"
        ],
        correctAnswer: 2,
        explanation: "The ramp height is changed deliberately to see how it affects the trolley’s speed."
    },
    {
        question: "What is the dependent variable in this experiment?",
        options: [
            "Average speed of the trolley",
            "Distance between light gates",
            "Height of the ramp",
            "Mass of the trolley"
        ],
        correctAnswer: 0,
        explanation: "The average speed is measured to see how it changes with ramp height."
    },
    {
        question: "What does each light gate measure?",
        options: [
            "The distance the trolley travels",
            "The acceleration of the trolley",
            "The time it takes for the trolley to pass between the two gates",
            "The force of the trolley"
        ],
        correctAnswer: 2,
        explanation: "Light gates record the time taken for the trolley to move between them, which is used to calculate speed."
    },
    {
        question: "How is the average speed of the trolley calculated?",
        options: [
            "Average speed = average time / height",
            "Average speed = mass × height",
            "Average speed = distance between gates / average time",
            "Average speed = height / time"
        ],
        correctAnswer: 2,
        explanation: "Speed is found by dividing the distance travelled by the average time taken."
    },
    {
        question: "Why should the experiment be repeated for each ramp height?",
        options: [
            "To change the distance between the light gates",
            "To increase the mass of the trolley",
            "To make the experiment shorter",
            "To reduce random errors and find a reliable mean time"
        ],
        correctAnswer: 3,
        explanation: "Repeating measurements and taking a mean reduces random errors and improves reliability."
    },
    {
        question: "Which variable must be kept constant throughout the experiment?",
        options: [
            "The height of the ramp",
            "The trolley’s mass",
            "The time of day",
            "The distance between the light gates"
        ],
        correctAnswer: 3,
        explanation: "The distance between light gates must stay the same to ensure fair comparisons of speed."
    },
    {
        question: "On your graph, which quantity should be plotted on the horizontal axis (x-axis)?",
        options: [
            "Distance between light gates",
            "Average time",
            "Average speed",
            "Height of the ramp"
        ],
        correctAnswer: 3,
        explanation: "The independent variable (height of ramp) is plotted on the x-axis."
    },
    {
        question: "What relationship is expected between the height of the ramp and the average speed?",
        options: [
            "As the height increases, the speed stays the same",
            "As the height increases, the speed increases",
            "As the height increases, the speed decreases",
            "There is no relationship"
        ],
        correctAnswer: 1,
        explanation: "Increasing the ramp height increases the gravitational potential energy and therefore the trolley’s speed."
    },
    {
        question: "What should you do if one result does not fit the pattern on your graph?",
        options: [
            "Change the line of best fit to include it",
            "Record it as correct anyway",
            "Identify it as an anomaly and repeat the measurement",
            "Ignore it completely"
        ],
        correctAnswer: 2,
        explanation: "Anomalous results should be noted and the measurement repeated to check accuracy."
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
      resultMessage.textContent = "Perfect! You're a speed hero!";
    } else if (score >= 8) {
      resultMessage.textContent = "Excellent! You understand speed well.";
    } else if (score >= 6) {
      resultMessage.textContent = "Good job! You know most key concepts about the speeed investigation.";
    } else if (score >= 4) {
      resultMessage.textContent = "You're learning - review what variables are.";
    } else {
      resultMessage.textContent = "Revise the basics of investigation technique and try again!";
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
