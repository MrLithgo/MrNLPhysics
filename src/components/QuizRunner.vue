<template>
  <div class="quiz-runner">
    <header class="site-header">
      <div class="header-inner">
        <div class="site-title">Mr NL's Physics Lab</div>
        <h1 class="page-title">{{ quizConfig.title }}</h1>
        <p class="page-sub">{{ quizConfig.subtitle }}</p>
      </div>
    </header>

    <main class="main">
      <section class="quiz-wrap">
        <div class="quiz-container">
          <div class="quiz-header">
            <QuizLogo 
              :icon-id="quizConfig.iconId" 
              size="large" 
            />
          </div>

          <ProgressBar 
            v-if="!showResults"
            :current-question="currentQuestion"
            :total-questions="questions.length"
            :score="score"
          />

          <QuestionCard
            v-if="!showResults"
            :question-data="currentQuestionData"
            :question-index="currentQuestion"
            :answer-submitted="answerSubmitted"
            :user-answer="getUserAnswer(currentQuestion)"
            :is-last-question="currentQuestion === questions.length - 1"
            @answer-submitted="submitAnswer"
            @next-question="nextQuestion"
          />

          <ResultsCard
            v-else
            :score="score"
            :total-questions="questions.length"
            :user-answers="userAnswers"
            :questions="questions"
            @restart-quiz="restartQuiz"
            @return-to-selection="$emit('return-to-selection')"
          />
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import QuizLogo from './QuizLogo.vue'
import ProgressBar from './ProgressBar.vue'
import QuestionCard from './QuestionCard.vue'
import ResultsCard from './ResultsCard.vue'

export default {
  name: 'QuizRunner',
  components: {
    QuizLogo,
    ProgressBar,
    QuestionCard,
    ResultsCard
  },
  props: {
    quizConfig: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      currentQuestion: 0,
      score: 0,
      answerSubmitted: false,
      showResults: false,
      userAnswers: []
    }
  },
  computed: {
    questions() {
      return this.quizConfig.questions || []
    },
    currentQuestionData() {
      return this.questions[this.currentQuestion]
    }
  },
  methods: {
    submitAnswer(answer) {
      this.answerSubmitted = true;
      
      const isCorrect = answer === this.currentQuestionData.correctAnswer;
      if (isCorrect) {
        this.score++;
      }
      
      this.userAnswers.push({
        question: this.currentQuestion,
        userAnswer: answer,
        correct: isCorrect
      });
    },
    nextQuestion() {
      this.currentQuestion++;
      this.answerSubmitted = false;
      
      if (this.currentQuestion >= this.questions.length) {
        this.showResults = true;
        this.$emit('quiz-completed', {
          quizId: this.quizConfig.id,
          score: this.score,
          totalQuestions: this.questions.length,
          userAnswers: this.userAnswers
        })
      }
    },
    restartQuiz() {
      this.currentQuestion = 0;
      this.score = 0;
      this.answerSubmitted = false;
      this.showResults = false;
      this.userAnswers = [];
    },
    getUserAnswer(questionIndex) {
      const answer = this.userAnswers.find(a => a.question === questionIndex);
      return answer ? answer.userAnswer : null;
    }
  },
  emits: ['quiz-completed', 'return-to-selection']
}
</script>

<style scoped>
.quiz-runner {
  min-height: 100vh;
}

.quiz-wrap {
  width: 100%;
  max-width: var(--max-width);
}

.quiz-container {
  background: linear-gradient(145deg, #ffffff, #f5f9ff);
  padding: 28px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(44,62,80,0.08);
}

.quiz-header {
  margin-bottom: 24px;
}

@media (min-width: 720px) {
  .quiz-container {
    padding: 36px;
  }
}
</style>
