<template>
  <div>
    <!-- Toast container (bottom-right) -->
    <div class="ui-toast-container" aria-live="polite" aria-atomic="true">
      <div
        v-for="t in toasts"
        :key="t.id"
        class="ui-toast"
        :class="{ 'ui-toast--show': t.visible }"
        role="status"
      >
        <div class="ui-toast__title">{{ t.title }}</div>
        <div class="ui-toast__msg">{{ t.message }}</div>
        <button class="ui-toast__close" @click="removeToast(t.id)" aria-label="Close">×</button>
      </div>
    </div>

    <!-- Simple modal (centered) -->
    <div v-if="modal.visible" class="ui-modal-backdrop" @click.self="closeModal">
      <div class="ui-modal" role="dialog" aria-modal="true" :aria-label="modal.title">
        <header class="ui-modal__header">
          <h3>{{ modal.title }}</h3>
        </header>
        <div class="ui-modal__body">
          <p v-html="modal.message"></p>
        </div>
        <footer class="ui-modal__footer">
          <button class="btn" @click="closeModal">Close</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
let nextId = 1

export default {
  name: 'UiNotify',
  data() {
    return {
      toasts: [],
      modal: {
        visible: false,
        title: '',
        message: ''
      }
    }
  },
  mounted() {
    // Listen for UI events from anywhere in the app
    window.addEventListener('ui-notify', this.handleEvent)
  },
  beforeUnmount() {
    window.removeEventListener('ui-notify', this.handleEvent)
  },
  methods: {
    handleEvent(e) {
      const d = e.detail || {}
      // d = { type: 'toast'|'modal', title, message, duration }
      if (d.type === 'toast') this.showToast(d)
      else if (d.type === 'modal') this.showModal(d)
    },

    showToast({ title = '', message = '', duration = 3500 } = {}) {
      const id = nextId++
      const toast = { id, title, message, visible: false }
      this.toasts.push(toast)

      // tiny nextTick so CSS transition can run
      this.$nextTick(() => {
        const t = this.toasts.find(tt => tt.id === id)
        if (t) t.visible = true
      })

      // auto dismiss
      setTimeout(() => this.dismissToast(id), duration)
    },

    dismissToast(id) {
      const t = this.toasts.find(tt => tt.id === id)
      if (!t) return
      t.visible = false
      // remove after transition
      setTimeout(() => this.removeToast(id), 300)
    },

    removeToast(id) {
      this.toasts = this.toasts.filter(tt => tt.id !== id)
    },

    showModal({ title = 'Notice', message = '' } = {}) {
      // Replace existing modal content and show
      this.modal.title = title
      this.modal.message = message
      this.modal.visible = true
    },

    closeModal() {
      this.modal.visible = false
    }
  }
}
</script>

<style scoped>
/* Toasts */
.ui-toast-container {
  position: fixed;
  right: 20px;
  bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 1100;
  pointer-events: none; /* allow clicks through except on toast itself */
}

.ui-toast {
  pointer-events: auto;
  min-width: 240px;
  max-width: 360px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(16,24,40,0.12);
  padding: 12px 14px;
  transform: translateY(8px);
  opacity: 0;
  transition: transform .28s ease, opacity .28s ease;
  border-left: 4px solid rgba(26,188,156,0.95);
  position: relative;
}

.ui-toast--show {
  transform: translateY(0);
  opacity: 1;
}

.ui-toast__title {
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 4px;
}

.ui-toast__msg {
  font-size: 13px;
  color: #334155;
  line-height: 1.25;
}

.ui-toast__close {
  position: absolute;
  top: 6px;
  right: 8px;
  border: none;
  background: transparent;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  color: #475569;
}

/* Modal */
.ui-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(2,6,23,0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1200;
  padding: 20px;
}

.ui-modal {
  background: #fff;
  border-radius: 12px;
  width: 100%;
  max-width: 560px;
  box-shadow: 0 18px 40px rgba(2,6,23,0.35);
  overflow: hidden;
}

.ui-modal__header {
  padding: 18px 20px;
  border-bottom: 1px solid #eef2f7;
}

.ui-modal__header h3 {
  margin: 0;
  font-size: 18px;
}

.ui-modal__body {
  padding: 20px;
  color: #1f2937;
}

.ui-modal__footer {
  padding: 12px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  border-top: 1px solid #eef2f7;
}

/* Button baseline (you can replace with your .btn styles) */
.btn {
  background: var(--navy, #2c3e50);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
}
</style>
