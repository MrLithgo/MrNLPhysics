<template>
  <div class="quiz-content">
    <div class="question-block">
      <div class="question-title">{{ questionData.question }}</div>
      <form @submit.prevent="$emit('answer-submitted', selectedAnswer)">
        <div class="options">
          <div 
            v-for="(option, index) in questionData.options" 
            :key="index" 
            class="option-item"
          >
            <label 
              :class="getOptionClass(index)" 
              @click="!answerSubmitted && selectAnswer(index)"
            >
              <input 
                type="radio" 
                :name="`answer${questionIndex}`" 
                :value="index" 
                v-model="selectedAnswer"
                :disabled="answerSubmitted"
              >
              <span class="option-text">{{ option }}</span>
            </label>
          </div>
        </div>
        <div style="margin-top:14px;">
          <QuizButton 
            type="submit" 
            :disabled="answerSubmitted || selectedAnswer === null"
          >
            Submit Answer
          </QuizButton>
        </div>
      </form>
    </div>
    
    <div v-if="showFeedback" :class="feedbackClass">
      <div style="display:flex;align-items:flex-start;gap:10px;">
        <div style="flex-shrink:0;">
          <svg class="icon" viewBox="0 0 20 20">
            <path v-if="isCorrect" fill="currentColor" d="M7.4 13.4L4 10l1.4-1.4L7.4 10.6 14.6 3.4 16 4.8z"></path>
            <path v-else fill="currentColor" d="M10 8.6l3.2-3.2 1.4 1.4L11.4 10l3.2 3.2-1.4 1.4L10 11.4l-3.2 3.2-1.4-1.4L8.6 10 5.4 6.8 6.8 5.4 10 8.6z"></path>
          </svg>
        </div>
        <div>
          <p style="margin:0 0 6px;font-weight:600;">
            {{ isCorrect ? 'Correct!' : 'Incorrect!' }}
          </p>
          <p style="margin:0;font-size:14px;" v-html="questionData.explanation"></p>
        </div>
      </div>
      <div style="margin-top:12px;">
        <QuizButton @click="$emit('next-question')">
          {{ isLastQuestion ? 'See Results' : 'Next Question' }}
        </QuizButton>
      </div>
    </div>
  </div>
</template>

<script>
import QuizButton from './QuizButton.vue'

export default {
  name: 'QuestionCard',
  components: { QuizButton },
  props: {
    questionData: {
      type: Object,
      required: true
    },
    questionIndex: {
      type: Number,
      required: true
    },
    answerSubmitted: {
      type: Boolean,
      default: false
    },
    userAnswer: {
      type: Number,
      default: null
    },
    isLastQuestion: {
      type: Boolean,
      default: false
    }
  },
  emits: ['answer-submitted', 'next-question'],
  data() {
    return {
      selectedAnswer: null
    }
  },
  computed: {
    isCorrect() {
      return this.selectedAnswer === this.questionData.correctAnswer;
    },
    showFeedback() {
      return this.answerSubmitted;
    },
    feedbackClass() {
      return `feedback ${this.isCorrect ? 'correct' : 'incorrect'}`;
    }
  },
  methods: {
    selectAnswer(index) {
      this.selectedAnswer = index;
    },
    getOptionClass(index) {
      if (!this.answerSubmitted) {
        return 'option-label';
      }
      
      if (index === this.questionData.correctAnswer) {
        return 'option-label correct-answer';
      } else if (index === this.selectedAnswer && !this.isCorrect) {
        return 'option-label wrong-answer';
      }
      
      return 'option-label';
    }
  },
  watch: {
    questionData: {
      handler() {
        this.selectedAnswer = this.userAnswer;
      },
      immediate: true
    }
  }
}
</script>

<style scoped>
.quiz-content .question-block { margin-bottom: 10px; }
.question-title { 
  font-family: "Montserrat", sans-serif; 
  font-weight: 600; 
  font-size: 18px; 
  color: var(--navy); 
  margin-bottom: 12px; 
}

.options { display: block; margin: 0; padding: 0; list-style: none; }
.option-item { margin-bottom: 10px; }
.option-label {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #d7dde2;
  cursor: pointer;
  transition: background 0.25s ease, border-color 0.25s ease, transform 0.25s ease;
  background: white;
}
.option-label:hover { background: #f5fbfb; transform: translateY(-2px); border-color: var(--teal);}
.option-label input[type="radio"] { margin-top: 4px; transform: translateY(0); }

.correct-answer { background: rgba(26,188,156,0.08) !important; border-color: var(--teal) !important; }
.wrong-answer { background: rgba(231,76,60,0.08) !important; border-color: var(--coral) !important; }

.feedback {
  padding: 12px;
  border-radius: 10px;
  margin-top: 12px;
}
.feedback.correct { border: 1px solid var(--teal); background: rgba(26,188,156,0.06); color: var(--navy); }
.feedback.incorrect { border: 1px solid var(--coral); background: rgba(231,76,60,0.06); color: var(--navy); }
.feedback .icon { width: 20px; height: 20px; vertical-align: middle; margin-right: 8px; }
</style>
