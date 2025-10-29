
<template>
  <button 
    :class="buttonClasses" 
    :type="type"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'QuizButton',
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary'].includes(value)
    },
    type: {
      type: String,
      default: 'button'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click'],
  computed: {
    buttonClasses() {
      return {
        'btn': true,
        'btn-primary': this.variant === 'primary',
        'btn-secondary': this.variant === 'secondary'
      };
    }
  }
}
</script>

<style scoped>
.btn {
  display: inline-block;
  border: none;
  cursor: pointer;
  border-radius: 10px;
  padding: 10px 16px;
  font-weight: 600;
  font-family: "Inter", sans-serif;
  transition: transform 0.25s ease, opacity 0.25s ease;
}
.btn:active { transform: translateY(1px); }
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn-primary {
  background: var(--teal);
  color: #fff;
}
.btn-primary:hover:not(:disabled) { 
  opacity: .95; 
  transform: scale(1.02); 
}
.btn-secondary {
  background: var(--slate);
  color: #fff;
}
</style>
