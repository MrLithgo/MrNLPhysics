document.addEventListener('DOMContentLoaded', function() {
   const questions = [
  {
    question: "In a simple series circuit with two identical resistors, what happens to the current?",
    options: [
      "It is different in each resistor",
      "It is the same through both resistors",
      "It splits between the resistors",
      "It depends on the order of the resistors"
    ],
    correctAnswer: 1,
    explanation: "In a series circuit, the current is the same at all points in the circuit because there is only one path for charge to flow."
  },
  {
    question: "How does the total potential difference (voltage) of a cell compare to the voltages across components in a series circuit?",
    options: [
      "The cell voltage is less than the voltage across each component",
      "The cell voltage is equal to the voltage across the largest resistor only",
      "The cell voltage is equal to the sum of the voltages across each component",
      "The cell voltage is shared equally regardless of resistance"
    ],
    correctAnswer: 2,
    explanation: "In a series circuit, the supply voltage is shared between components and the individual voltages add up to the cells voltage."
  },
  {
    question: "What happens to the current in a series circuit if another resistor is added in series?",
    options: [
      "The current increases",
      "The current decreases",
      "The current stays the same",
      "The current becomes zero"
    ],
    correctAnswer: 1,
    explanation: "Adding a resistor in series increases the total resistance, which reduces the current for a fixed supply voltage."
  },
  {
    question: "In a parallel circuit, how does the potential difference (voltage) across each branch compare to the cell voltage?",
    options: [
      "Each branch has a smaller voltage than the cell",
      "Each branch has the same voltage as the cell",
      "The voltage is shared between the branches",
      "Only one branch gets the full cell voltage"
    ],
    correctAnswer: 1,
    explanation: "In a parallel circuit, each branch is connected directly across the cell, so each branch has the full battery voltage."
  },
  {
    question: "How does the total current from the cell in a parallel circuit compare to the currents in each branch?",
    options: [
      "It is equal to the current in the largest branch only",
      "It is the same as the current in each branch",
      "It is the sum of the currents in all the branches",
      "It is less than the current in any branch"
    ],
    correctAnswer: 2,
    explanation: "In a parallel circuit, the total current from the supply equals the sum of the currents in each branch."
  },
  {
    question: "What happens to the total current drawn from the cell if an extra parallel branch is added?",
    options: [
      "The total current decreases",
      "The total current stays the same",
      "The total current increases",
      "The total current becomes zero"
    ],
    correctAnswer: 2,
    explanation: "Adding another branch in parallel provides an additional path for current, reducing the total resistance and increasing the total current drawn from the cell."
  },
  {
    question: "Which statement about current in a parallel circuit is correct?",
    options: [
      "The current is the same in every branch",
      "The current splits between the branches",
      "The current is zero in one branch",
      "The current depends only on the battery, not the branches"
    ],
    correctAnswer: 1,
    explanation: "In a parallel circuit, the total current splits between the branches depending on their resistances."
  },
  {
    question: "Two identical bulbs are connected in parallel to a cell. Compared to one bulb on its own, how does the brightness of each bulb change?",
    options: [
      "Each bulb is dimmer",
      "Each bulb is brighter",
      "Each bulb is the same brightness",
      "One bulb is brighter and one is dimmer"
    ],
    correctAnswer: 2,
    explanation: "In parallel, each bulb has the full cell voltage across it, so each bulb is as bright as a single bulb connected on its own."
  },
  {
    question: "Two identical bulbs are connected in series to a cell. Compared to one bulb on its own, how does the brightness of each bulb change?",
    options: [
      "Each bulb is brighter",
      "Each bulb is the same brightness",
      "Each bulb is dimmer",
      "One bulb is off and one is on"
    ],
    correctAnswer: 2,
    explanation: "In series, the supply voltage is shared between the bulbs, so each bulb has a smaller voltage across it and is therefore dimmer."
  },
  {
    question: "Which change will increase the current in a simple series circuit with a fixed cell voltage?",
    options: [
      "Adding another resistor in series",
      "Replacing a resistor with one of higher resistance",
      "Replacing a resistor with one of lower resistance",
      "Connecting another bulb in series"
    ],
    correctAnswer: 2,
    explanation: "Reducing the total resistance in a series circuit increases the current for a fixed battery voltage, according to I = V / R."
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
      resultMessage.textContent = "Perfect! You're a circuits master!";
    } else if (score >= 8) {
      resultMessage.textContent = "Excellent! You understand circuits well.";
    } else if (score >= 6) {
      resultMessage.textContent = "Good job! You know most key concepts about circuits.";
    } else if (score >= 4) {
      resultMessage.textContent = "You're learning - review circuits again.";
    } else {
      resultMessage.textContent = "Revise the basics of circuits and try again!";
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
