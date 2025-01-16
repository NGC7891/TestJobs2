<script setup lang="ts">
import { defineProps, computed, useCssModule } from 'vue'
import type { Variant, TextColor, Spacing, BorderRadius } from './types'

const styles = useCssModule()

// Если не передали то не используем доп атрибуты внешнего класса
defineOptions({ inheritAttrs: false })

interface labelProps {
  variant?: Variant
  spacing?: Spacing
  disabled?: boolean
  textColor?: TextColor
  fullWidth?: boolean
  text?: string,
  radius?: BorderRadius,
  isHover?: boolean,
  isCursor?: boolean,
}

const props = withDefaults(defineProps<labelProps>(), {
  variant: 'primary',
  spacing: () => ({ x: 'none', y: 'none' }),
  radius: 'r50',
  disabled: false,
  fullWidth: false,
  textColor: 'yellow',
  text: '',
  isHover: false,
  isCursor: false,
})


// Вычислим, что бы не пересчитовать
const labelClasses = computed(() => [
  styles.label,
  styles[`label-spacing-x_${props.spacing.x}`],
  styles[`label-spacing-y_${props.spacing.y}`],
  styles[`label-bg_${props.variant}`],
  styles[`label-radius_${props.radius}`],
  props.fullWidth && styles.label_full,
  props.radius && styles[`label-radius_${props.radius}`],
  props.isHover && styles.label_hover,
  props.isCursor && styles.label_cursor
])

const textClasses = computed(() => [
  styles.text,
  props.textColor && styles[`text-color_${props.textColor}`],
])


</script>
<template>
  <label :class="[labelClasses, $attrs.class]" :disabled="disabled">
    <span v-if="text" :class="textClasses">
      {{ text }}
    </span>
    <slot />
  </label>
</template>


<style lang="css" module>
.label {
  position: relative;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  letter-spacing: 0.03rem;
  white-space: nowrap;
  cursor: default;
  user-select: none;
  transition: all 0.2s ease;
  border-radius: 0;
  color: inherit;
  box-shadow: none;
}

.text {
  color: var(--color-dark)
}

/* Модификаторы падинга у контента */
.label-spacing-x_none {
  padding-left: 0;
  padding-right: 0;
}

.label-spacing-x_xs {
  padding-left: var(--space-xs);
  padding-right: var(--space-xs);
}

.label-spacing-x_sm {
  padding-left: var(--space-sm);
  padding-right: var(--space-sm);
}

.label-spacing-x_md {
  padding-left: var(--space-md);
  padding-right: var(--space-md);
}

.label-spacing-x_lg {
  padding-left: var(--space-lg);
  padding-right: var(--space-lg);
}

.label-spacing-x_xl {
  padding-left: var(--space-xl);
  padding-right: var(--space-xl);
}

.label-spacing-y_none {
  padding-top: 0;
  padding-bottom: 0;
}

.label-spacing-y_xs {
  padding-top: var(--space-xs);
  padding-bottom: var(--space-xs);
}

.label-spacing-y_sm {
  padding-top: var(--space-sm);
  padding-bottom: var(--space-sm);
}

.label-spacing-y_md {
  padding-top: var(--space-md);
  padding-bottom: var(--space-md);
}

.label-spacing-y_lg {
  padding-top: var(--space-lg);
  padding-bottom: var(--space-lg);
}

.label-spacing-y_xl {
  padding-top: var(--space-xl);
  padding-bottom: var(--space-xl);
}

/* Модификаторы цвета бэкграунда */
.label-bg_success {
  background-color: var(--color-green);
}

.label-bg_danger {
  background-color: var(--color-red);
}

.label-bg_primary {
  background-color: var(--color-text);
}

.label-bg_accent {
  background-color: var(--color-blue-30);
}

.label-bg_info {
  background-color: var(--color-blue);
}

.label-bg_done {
  background-color: var(--color-orange);
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
.label-radius_r0 {
  border-radius: 0;
}

.label-radius_r4 {
  border-radius: 4px;
}

.label-radius_r8 {
  border-radius: 8px;
}

.label-radius_r16 {
  border-radius: 16px;
}

.label-radius_r50 {
  border-radius: 50px;
}

.label_full {
  width: 100%;
}

/* Модификаторы наведения */
.label_hover:hover:not(:disabled) {
  box-shadow: 0 0 7px rgba(255, 255, 255, 0.7);
}

.label_cursor {
  cursor: pointer;
}
</style>
