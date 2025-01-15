export type SpacingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type Variant = 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'primary' | 'accent'
export type TextColor = 'white' | 'dark' | 'yellow'
export type BorderRadius = 'r0' | 'r4' | 'r8' | 'r16' | 'r50'

export interface Spacing {
  x?: SpacingSize
  y?: SpacingSize
}
