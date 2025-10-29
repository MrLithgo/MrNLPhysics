<template>
  <div class="result-card show">
    <h2 class="results-title">Quiz Results</h2>
    <div class="final-score">{{ score }}/{{ totalQuestions }}</div>
    <p class="result-message">{{ resultMessage }}</p>

    <ProgressBar 
      :score="score"
      :total-questions="totalQuestions"
      size="small"
      :show-count="true"
      :current-question="0"
    />

    <div class="result-actions">
      <QuizButton @click="$emit('restart-quiz')" class="restart-btn">
        Restart Quiz
      </QuizButton>
      <QuizButton @click="$emit('return-to-selection')" variant="secondary">
        Back to Quizzes
      </QuizButton>
    </div>

    <div class="review-section">
      <h3>Review Your Answers</h3>
      <div class="review-list">
        <div 
          v-for="(answer, index) in userAnswers" 
          :key="index" 
          :class="['review-item', answer.correct ? 'correct' : 'incorrect']"
        >
          <p style="margin:0 0 6px;font-weight:600;">
            Question {{ index + 1 }}: {{ questions[answer.question].question }}
          </p>
          <p style="margin:0 0 4px;">
            <strong>Your answer:</strong> {{ questions[answer.question].options[answer.userAnswer] }}
          </p>
          <p v-if="!answer.correct" style="margin:0;">
            <strong>Correct answer:</strong> {{ questions[answer.question].options[questions[answer.question].correctAnswer] }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProgressBar from './ProgressBar.vue'
import QuizButton from './QuizButton.vue'

export default {
  name: 'ResultsCard',
  components: { ProgressBar, QuizButton },
  props: {
    score: {
      type: Number,
      required: true
    },
    totalQuestions: {
      type: Number,
      required: true
    },
    userAnswers: {
      type: Array,
      required: true
    },
    questions: {
      type: Array,
      required: true
    }
  },
  emits: ['restart-quiz', 'return-to-selection'],
  computed: {
    resultMessage() {
      if (this.score === this.totalQuestions) {
        return "Perfect! You're a physics expert!";
      } else if (this.score >= this.totalQuestions * 0.8) {
        return "Excellent! You understand this topic well.";
      } else if (this.score >= this.totalQuestions * 0.6) {
        return "Good job! You know most key concepts.";
      } else if (this.score >= this.totalQuestions * 0.4) {
        return "You're learning - keep practicing!";
      } else {
        return "Review the material and try again!";
      }
    }
  }
}
</script>

<style scoped>
.result-card {
  background: #fff;
  margin-top: 16px;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(44,62,80,0.06);
}

.results-title { 
  font-family: "Montserrat", sans-serif; 
  font-size: 24px; 
  font-weight: 700; 
  color: var(--navy); 
  text-align: center; 
  margin-bottom: 16px; 
}
.final-score { 
  font-family: "Montserrat", sans-serif; 
  font-size: 48px; 
  color: var(--teal); 
  text-align: center; 
  font-weight: 700; 
  margin-bottom: 12px;
}
.result-message { 
  text-align: center; 
  margin-bottom: 24px; 
  font-size: 16px; 
  color: var(--navy); 
}

.result-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin: 24px 0;
}

.review-section { margin-top: 32px; }
.review-section h3 { 
  font-family: "Montserrat", sans-serif; 
  margin-bottom: 16px; 
  color: var(--navy); 
  font-size: 20px;
}
.review-list .review-item { 
  padding: 16px; 
  border-radius: 10px; 
  border: 1px solid #e6e9ec; 
  margin-bottom: 12px; 
  background: #fff; 
}
.review-item.correct { 
  border-color: var(--teal); 
  background: rgba(26,188,156,0.05); 
}
.review-item.incorrect { 
  border-color: var(--coral); 
  background: rgba(231,76,60,0.05); 
}
</style>
