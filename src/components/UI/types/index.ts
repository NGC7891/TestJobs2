export type SpacingSize = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type Variant = 'success' | 'danger' | 'info' | 'dark' | 'primary' | 'accent' | 'done'
export type TextColor = 'white' | 'dark' | 'yellow'
export type BorderRadius = 'r0' | 'r4' | 'r8' | 'r16' | 'r50'

export interface Spacing {
  x?: SpacingSize
  y?: SpacingSize
}
