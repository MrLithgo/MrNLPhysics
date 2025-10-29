<template>
  <div 
    :class="logoClasses" 
    :style="logoStyles"
    v-html="iconSvg"
  ></div>
</template>

<script>
import { getIcon } from '@/components/icons'

export default {
  name: 'QuizLogo',
  props: {
    size: {
      type: String,
      default: 'large',
      validator: (value) => ['small', 'medium', 'large'].includes(value)
    },
    iconId: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: null
    }
  },
  computed: {
    iconSvg() {
      const icon = getIcon(this.iconId)
      return icon ? icon.svg : ''
    },
    logoClasses() {
      return {
        'logo': true,
        'logo-small': this.size === 'small',
        'logo-medium': this.size === 'medium',
        'logo-large': this.size === 'large'
      }
    },
    logoStyles() {
      return {
        '--logo-color': this.color || 'currentColor'
      }
    }
  }
}
</script>

<style scoped>
.logo { 
  display: flex;
  align-items: center;
  justify-content: center;
}
.logo-small { 
  width: 36px; 
  height: 36px; 
}
.logo-medium { 
  width: 60px; 
  height: 60px; 
}
.logo-large { 
  width: 120px; 
  height: 120px; 
  margin: 0 auto 16px;
}

.logo :deep(svg) {
  width: 100%;
  height: 100%;
  fill: none;
  stroke: var(--logo-color, currentColor);
  color: var(--logo-color, currentColor);
}
</style>
