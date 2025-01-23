<script setup lang="ts">
import { computed, useCssModule, ref, watchEffect } from 'vue'
import { onClickOutside, useScrollLock, onKeyStroke } from '@vueuse/core'
import type { Spacing, BorderRadius } from './types'

const styles = useCssModule()

interface ModalProps {
  modelValue: boolean,
  spacing?: Spacing
  title?: string,
  radius?: BorderRadius,
}

const props = withDefaults(defineProps<ModalProps>(), {
  modelValue: false,
  spacing: () => ({ x: 'none', y: 'none' }),
  title: '',
  radius: 'r0',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}>()

const modalRef = ref<HTMLElement | null>(null)

const getModalClasses = computed(() => ({
  [styles.modal]: true,
  [styles[`modal_spacing-x_${props.spacing.x}`]]: true,
  [styles[`modal_spacing-y_${props.spacing.y}`]]: true,
  [styles[`modal_radius_${props.radius}`]]: true
}))

// Единая функция закрытия
const closeModal = () => {
  emit('update:modelValue', false)
  emit('close')
}

// Используем onClickOutside для закрытия по клику вне модалки
onClickOutside(modalRef, () => {
  if (props.modelValue) {
    closeModal()
  }
})

// Используем useScrollLock для блокировки скролла
const isLocked = useScrollLock(document.body)

// Следим за состоянием модалки и блокируем/разблокируем скролл
watchEffect(() => {
  isLocked.value = props.modelValue
})

// Используем onKeyStroke для обработки Escape
onKeyStroke('Escape', (e) => {
  if (props.modelValue) {
    e.preventDefault()
    closeModal()
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" :class="styles['modal-overlay']">
        <div ref="modalRef" :class="getModalClasses" role="dialog" aria-modal="true">
          <div v-if="title" :class="styles.modal__header">
            <h3 :class="styles.modal__title">{{ title }}</h3>
            <button :class="styles.modal__close" @click="closeModal" aria-label="Закрыть">
              ×
            </button>
          </div>

          <div :class="styles.modal__content">
            <slot />
          </div>

          <div v-if="$slots.footer" :class="styles.modal__footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="css" module>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(16, 60, 111, 0.598);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  will-change: opacity;
}

.modal {
  background: var(--color-dark);
  position: relative;
  max-width: 90%;
  max-height: 90vh;
  min-width: 320px;
  overflow-y: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  will-change: transform;
}

/* Элементы */
.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md);
  border-bottom: 1px solid var(--color-border);
}

.modal__title {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: var(--text-color);
}

.modal__close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 4px 8px;
  color: var(--color-white);
  opacity: 0.6;
  transition: opacity 0.2s;
}

.modal__close:hover {
  opacity: 1;
}

.modal__content {
  position: relative;
}

.modal__footer {
  padding: var(--space-md);
  border-top: 1px solid var(--color-border);
}

/* Модификаторы отступов */
.modal_spacing-x_none {
  padding-left: 0;
  padding-right: 0;
}

.modal_spacing-x_sm {
  padding-left: var(--space-sm);
  padding-right: var(--space-sm);
}

.modal_spacing-x_md {
  padding-left: var(--space-md);
  padding-right: var(--space-md);
}

.modal_spacing-y_none {
  padding-top: 0;
  padding-bottom: 0;
}

.modal_spacing-y_sm {
  padding-top: var(--space-sm);
  padding-bottom: var(--space-sm);
}

.modal_spacing-y_md {
  padding-top: var(--space-md);
  padding-bottom: var(--space-md);
}

/* Модификаторы радиуса */
.modal_radius_r0 {
  border-radius: 0;
}

.modal_radius_r4 {
  border-radius: 4px;
}

.modal_radius_r8 {
  border-radius: 8px;
}

.modal_radius_r16 {
  border-radius: 16px;
}

.modal_radius_r50 {
  border-radius: 50px;
}

/* Оптимизированные анимации */
:global(.modal-enter-active),
:global(.modal-leave-active) {
  transition: opacity 0.3s ease;
}

:global(.modal-enter-from),
:global(.modal-leave-to) {
  opacity: 0;
}

:global(.modal-enter-active .modal) {
  animation: modal-in 0.3s ease-out forwards;
}

:global(.modal-leave-active .modal) {
  animation: modal-out 0.3s ease-in forwards;
}

@keyframes modal-in {
  from {
    transform: translate3d(0, -50px, 0);
  }

  to {
    transform: translate3d(0, 0, 0);
  }
}

@keyframes modal-out {
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    transform: translate3d(0, -50px, 0);
  }
}
</style>
