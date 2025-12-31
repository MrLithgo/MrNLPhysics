document.addEventListener('DOMContentLoaded', function () {
  const questions = [
    {
      question: 'What does a compass needle align with?',
      options: [
        'Electric current',
        'Magnetic field lines',
        'Gravitational force',
        'Electric field lines',
      ],
      correctAnswer: 1,
      explanation: 'A compass needle aligns itself with the direction of magnetic field lines.',
    },
    {
      question: 'Outside a bar magnet, magnetic field lines travel from:',
      options: ['South to north', 'North to south', 'Centre to edges', 'Both directions equally'],
      correctAnswer: 1,
      explanation: 'Magnetic field lines leave the north pole and enter the south pole.',
    },
    {
      question: 'Which part of a bar magnet produces the strongest magnetic field?',
      options: [
        'The centre',
        'The ends (poles)',
        'The entire surface equally',
        'Only the north pole',
      ],
      correctAnswer: 1,
      explanation:
        'The magnetic field is strongest at the poles, which are at the ends of the magnet.',
    },
    {
      question: 'What happens to magnetic field strength as distance from the magnet increases?',
      options: ['It increases', 'It stays constant', 'It decreases', 'It reverses direction'],
      correctAnswer: 2,
      explanation: 'Magnetic field strength decreases as you move further away from the magnet.',
    },

    {
      question: 'If two like poles face each other, what happens to the field lines between them?',
      options: ['They join together', 'They disappear', 'They spread apart', 'They form circles'],
      correctAnswer: 2,
      explanation: 'Like poles repel, causing magnetic field lines to spread apart.',
    },
    {
      question: 'If two unlike poles face each other, the field lines between them:',
      options: ['Cancel out', 'Become weaker', 'Join smoothly', 'Reverse direction'],
      correctAnswer: 2,
      explanation: 'Unlike poles attract, so the field lines join smoothly between them.',
    },
    {
      question: 'What does the direction of a compass needle show?',
      options: [
        'The direction of force on the magnet',
        'The direction of electron flow',
        'The direction of the magnetic field',
        'The direction of gravity',
      ],
      correctAnswer: 2,
      explanation:
        'The compass needle points in the direction of the magnetic field at that location.',
    },

    {
      question: 'Which statement about magnetic field lines is correct?',
      options: [
        'They can cross each other',
        'They show the path a magnet moves',
        'They never cross',
        'They only exist near north poles',
      ],
      correctAnswer: 2,
      explanation:
        'Magnetic field lines never cross because the field has only one direction at any point.',
    },

    {
      question: 'Why are magnetic field diagrams drawn with arrows?',
      options: [
        'To show field strength',
        'To show magnet shape',
        'To show field direction',
        'To show electric charge',
      ],
      correctAnswer: 2,
      explanation: 'Arrows on field lines show the direction of the magnetic field.',
    },

    {
      question: 'Why is plotting magnetic fields considered indirect measurement?',
      options: [
        'The magnet cannot be seen',
        'The compass is inaccurate',
        'The field itself is invisible',
        'The poles move during the experiment',
      ],
      correctAnswer: 2,
      explanation: 'Magnetic fields are invisible, so we infer their shape using compasses.',
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
      resultMessage.textContent = "Perfect! You're a magnets master!"
    } else if (score >= 8) {
      resultMessage.textContent = 'Excellent! You understand magnetic fields well.'
    } else if (score >= 6) {
      resultMessage.textContent = 'Good job! You know most key concepts about magnetic fields.'
    } else if (score >= 4) {
      resultMessage.textContent = "You're learning - review what magnetic fields are."
    } else {
      resultMessage.textContent = 'Revise the basics of magnets and magnetic fields and try again!'
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
