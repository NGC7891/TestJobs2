<script setup lang="ts">
import { defineProps, defineEmits, computed, useCssModule } from 'vue'
import type { Variant, TextColor, Spacing, BorderRadius } from './types'

const styles = useCssModule()

// Если не передали то не используем доп атрибуты внешнего класса
defineOptions({ inheritAttrs: false })

interface ButtonProps {
  variant?: Exclude<Variant, 'info'>
  spacing?: Spacing
  disabled?: boolean
  textColor?: TextColor
  fullWidth?: boolean
  text?: string,
  radius?: BorderRadius,
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'primary',
  spacing: () => ({ x: 'none', y: 'none' }),
  radius: 'r0',
  disabled: false,
  fullWidth: false,
  textColor: 'yellow',
  text: ''
})


const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

// Вычислим, что бы не пересчитовать
const buttonClasses = computed(() => [
  styles.button,
  styles[`button-spacing-x_${props.spacing.x}`],
  styles[`button-spacing-y_${props.spacing.y}`],
  styles[`button-bg_${props.variant}`],
  styles[`button-radius_${props.radius}`],
  props.fullWidth && styles.button_full,
  props.radius && styles[`button-radius_${props.radius}`]
])

const textClasses = computed(() => [
  styles.text,
  props.textColor && styles[`text-color_${props.textColor}`],
])


const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event)
  }
}

</script>
<template>
  <button :class="[buttonClasses, $attrs.class]" :disabled="disabled" @click="handleClick">
    <span v-if="text" :class="textClasses">
      {{ text }}
    </span>
    <slot />
  </button>
</template>


<style lang="css" module>
.button {
  position: relative;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  letter-spacing: 0.03rem;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
  border-radius: 0;
  color: inherit;
}

.text {
  color: var(--color-dark)
}

/* Модификаторы падинга у контента */
.button-spacing-x_none {
  padding-left: 0;
  padding-right: 0;
}

.button-spacing-x_xs {
  padding-left: var(--space-xs);
  padding-right: var(--space-xs);
}

.button-spacing-x_sm {
  padding-left: var(--space-sm);
  padding-right: var(--space-sm);
}

.button-spacing-x_md {
  padding-left: var(--space-md);
  padding-right: var(--space-md);
}

.button-spacing-x_lg {
  padding-left: var(--space-lg);
  padding-right: var(--space-lg);
}

.button-spacing-x_xl {
  padding-left: var(--space-xl);
  padding-right: var(--space-xl);
}

.button-spacing-y_none {
  padding-top: 0;
  padding-bottom: 0;
}

.button-spacing-y_xs {
  padding-top: var(--space-xs);
  padding-bottom: var(--space-xs);
}

.button-spacing-y_sm {
  padding-top: var(--space-sm);
  padding-bottom: var(--space-sm);
}

.button-spacing-y_md {
  padding-top: var(--space-md);
  padding-bottom: var(--space-md);
}

.button-spacing-y_lg {
  padding-top: var(--space-lg);
  padding-bottom: var(--space-lg);
}

.button-spacing-y_xl {
  padding-top: var(--space-xl);
  padding-bottom: var(--space-xl);
}

/* Модификаторы цвета бэкграунда */
.button-bg_success {
  background-color: var(--color-green);
}

.button-bg_danger {
  background-color: var(--color-red);
}

.button-bg_primary {
  background-color: var(--color-text);
}

.button-bg_accent {
  background-color: var(--color-blue-30);
}

/* модификаторы цвета текств */
.text-color_white {
  color: var(--color-white);
}

.text-color_dark {
  color: var(--color-dark);
}

.text-color_yellow {
  color: var(--color-ligh-yellow);
}


/* Модификаторы радиуса */
.button-radius_r0 {
  border-radius: 0;
}

.button-radius_r4 {
  border-radius: 4px;
}

.button-radius_r8 {
  border-radius: 8px;
}

.button-radius_r16 {
  border-radius: 16px;
}

.button-radius_r50 {
  border-radius: 50px;
}

.button_full {
  width: 100%;
}

/* если не вырублена то анимируем */
.button:hover:not(:disabled) {
  box-shadow: 0 0 7px rgba(255, 255, 255, 0.7);
}

.button:active:not(:disabled) {
  transform: translateY(1px);
}
</style>
