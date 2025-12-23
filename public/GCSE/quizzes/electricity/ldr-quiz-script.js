document.addEventListener('DOMContentLoaded', function () {
  const questions = [
    {
      question: 'What does LDR stand for?',
      options: [
        'Low Density Resistor',
        'Light Dependent Resistor',
        'Long Distance Resistor',
        'Linear Dynamic Resistor',
      ],
      correctAnswer: 1,
      explanation:
        'An LDR is a Light Dependent Resistor, meaning its resistance depends on light intensity.',
    },
    {
      question: 'What is the independent variable in this experiment?',
      options: [
        'Resistance of the LDR',
        'Current through the circuit',
        'Light level on the LDR',
        'Temperature of the LDR',
      ],
      correctAnswer: 2,
      explanation: 'The independent variable is what you change, which is the light level.',
    },
    {
      question: 'What is the dependent variable in this experiment?',
      options: [
        'Light level',
        'Resistance of the LDR',
        'Position of the LDR',
        'Power supply voltage',
      ],
      correctAnswer: 1,
      explanation:
        'The resistance changes in response to the light level, making it the dependent variable.',
    },
    {
      question: 'Which piece of equipment is used to measure the resistance of the LDR?',
      options: ['A voltmeter', 'An ammeter', 'An ohmmeter', 'A light sensor'],
      correctAnswer: 2,
      explanation: 'An ohmmeter measures resistance directly.',
    },
    {
      question: 'As the light level on the LDR increases, what happens to its resistance?',
      options: ['It increases', 'It decreases', 'It stays the same', 'It becomes zero'],
      correctAnswer: 1,
      explanation: 'LDR resistance decreases as light intensity increases.',
    },
    {
      question: 'Why should several different light levels be tested?',
      options: [
        'To make the experiment longer',
        'To improve the reliability of the results',
        'To reduce the effect of temperature',
        'To avoid using a graph',
      ],
      correctAnswer: 1,
      explanation:
        'Using multiple values improves reliability and allows a clear trend to be identified.',
    },
    {
      question: 'Which unit is resistance recorded in for this experiment?',
      options: ['Ohms (Ω)', 'Volts (V)', 'Amps (A)', 'Watts (W)'],
      correctAnswer: 0,
      explanation: 'Resistance is measured in ohms, often recorded in kilo-ohms for an LDR.',
    },

    {
      question: 'What is the main conclusion from this experiment?',
      options: [
        'Resistance increases as light level increases',
        'Resistance is independent of light level',
        'Resistance decreases as light level increases',
        'Resistance becomes zero in bright light',
      ],
      correctAnswer: 2,
      explanation: 'An LDR has lower resistance at higher light levels.',
    },
    {
      question: 'Which real-life device commonly uses an LDR?',
      options: ['Electric kettle', 'Street light', 'Electric heater', 'Fuse'],
      correctAnswer: 1,
      explanation: 'Street lights use LDRs to switch on automatically when it gets dark.',
    },
    {
      question: 'How could the reliability of the results be improved?',
      options: [
        'Using fewer readings',
        'Repeating readings and calculating a mean',
        'Changing the LDR each time',
        'Increasing the power supply voltage',
      ],
      correctAnswer: 1,
      explanation: 'Repeating readings and finding the mean reduces random error.',
    },
  ]

  let currentQuestion = 0
  let score = 0
  let userAnswers = []

  const quizContent = document.getElementById('quiz-content')
  const questionNumberEl = document.getElementById('question-number')
  const progressBarEl = document.getElementById('progress-bar')
  const scoreDisplayEl = document.getElementById('score-display')

  function displayQuestion() {
    const q = questions[currentQuestion]

    questionNumberEl.textContent = `Question ${currentQuestion + 1}/${questions.length}`
    progressBarEl.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`

    let optionsHTML = ''
    q.options.forEach((opt, idx) => {
      optionsHTML += `
        <div class="option-item">
          <label class="option-label" data-index="${idx}">
            <input type="radio" name="answer" value="${idx}">
            <span class="option-text">${opt}</span>
          </label>
        </div>
      `
    })

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
    `

    const form = document.getElementById('quiz-form')
    form.addEventListener('submit', function (e) {
      e.preventDefault()
      submitAnswer()
    })
  }

  function submitAnswer() {
    const selected = document.querySelector('input[name="answer"]:checked')

    if (!selected) {
      alert('Please select an answer!')
      return
    }

    const answer = parseInt(selected.value, 10)
    const correct = answer === questions[currentQuestion].correctAnswer

    if (correct) {
      score++
      scoreDisplayEl.textContent = `Score: ${score}`
    }

    userAnswers.push({
      question: currentQuestion,
      userAnswer: answer,
      correct: correct,
    })

    // Show feedback
    const feedbackDiv = document.getElementById('feedback')
    feedbackDiv.classList.remove('hidden')
    feedbackDiv.className = 'feedback ' + (correct ? 'correct' : 'incorrect')

    // icon SVGs
    const icon = correct
      ? '<svg class="icon" viewBox="0 0 20 20"><path fill="currentColor" d="M7.4 13.4L4 10l1.4-1.4L7.4 10.6 14.6 3.4 16 4.8z"></path></svg>'
      : '<svg class="icon" viewBox="0 0 20 20"><path fill="currentColor" d="M10 8.6l3.2-3.2 1.4 1.4L11.4 10l3.2 3.2-1.4 1.4L10 11.4l-3.2 3.2-1.4-1.4L8.6 10 5.4 6.8 6.8 5.4 10 8.6z"></path></svg>'

    feedbackDiv.innerHTML = `
      <div style="display:flex;align-items:flex-start;gap:10px;">
        <div style="flex-shrink:0;">${icon}</div>
        <div>
          <p style="margin:0 0 6px;font-weight:600;">${correct ? 'Correct!' : 'Incorrect!'}</p>
          <p style="margin:0;font-size:14px;">${questions[currentQuestion].explanation}</p>
        </div>
      </div>
      <div style="margin-top:12px;">
        <button id="next-btn" class="btn btn-primary">${
          currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'
        }</button>
      </div>
    `

    // disable options
    const options = document.querySelectorAll('input[name="answer"]')
    options.forEach((opt) => (opt.disabled = true))

    // highlight correct and wrong
    const labels = document.querySelectorAll('.option-label')
    labels.forEach((label, idx) => {
      if (idx === questions[currentQuestion].correctAnswer) {
        label.classList.add('correct-answer')
      } else if (idx === answer && !correct) {
        label.classList.add('wrong-answer')
      }
    })

    const submitBtn = document.getElementById('submit-btn')
    if (submitBtn) submitBtn.disabled = true

    document.getElementById('next-btn').addEventListener('click', nextQuestion)
  }

  function nextQuestion() {
    currentQuestion++
    if (currentQuestion < questions.length) {
      displayQuestion()
    } else {
      showResults()
    }
  }

  function showResults() {
    document.getElementById('quiz-content').classList.add('hidden')
    const resultsEl = document.getElementById('results')
    resultsEl.classList.remove('hidden')

    // allow CSS transition to apply
    setTimeout(() => resultsEl.classList.add('show'), 50)

    document.getElementById('final-score').textContent = score
    document.getElementById('correct-count').textContent = score
    document.getElementById('final-progress').style.width = `${(score / questions.length) * 100}%`

    const resultMessage = document.getElementById('result-message')
    if (score === 10) {
      resultMessage.textContent = "Perfect! You're a moments master!"
    } else if (score >= 8) {
      resultMessage.textContent = 'Excellent! You understand moments well.'
    } else if (score >= 6) {
      resultMessage.textContent = 'Good job! You know most key concepts about turning forces.'
    } else if (score >= 4) {
      resultMessage.textContent = "You're learning - review what moments are."
    } else {
      resultMessage.textContent = 'Revise the basics of moments and turning forces and try again!'
    }

    // review list
    const reviewList = document.getElementById('review-list')
    reviewList.innerHTML = ''
    userAnswers.forEach((ans, i) => {
      const question = questions[ans.question]
      const correctClass = ans.correct ? 'correct' : 'incorrect'
      const correctAnswerText = question.options[question.correctAnswer]
      const userAnswerText = question.options[ans.userAnswer]

      const item = document.createElement('div')
      item.className = `review-item ${correctClass}`
      item.innerHTML = `
        <p style="margin:0 0 6px;font-weight:600;">Question ${i + 1}: ${question.question}</p>
        <p style="margin:0 0 4px;"><strong>Your answer:</strong> ${userAnswerText}</p>
        ${
          ans.correct
            ? ''
            : `<p style="margin:0;"><strong>Correct answer:</strong> ${correctAnswerText}</p>`
        }
      `
      reviewList.appendChild(item)
    })

    document.getElementById('restart-btn').addEventListener('click', restartQuiz)
  }

  function restartQuiz() {
    currentQuestion = 0
    score = 0
    userAnswers = []
    scoreDisplayEl.textContent = 'Score: 0'
    const resultsEl = document.getElementById('results')
    resultsEl.classList.remove('show')
    // hide then re-display question
    setTimeout(() => {
      resultsEl.classList.add('hidden')
      document.getElementById('quiz-content').classList.remove('hidden')
      displayQuestion()
    }, 300)
  }

  // start
  displayQuestion()
})
