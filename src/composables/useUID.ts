import type { UseUIDReturn, GenerateUIDFunction } from '@/types'

// Генерации UID
export function useUID(): UseUIDReturn {
  const generateUID: GenerateUIDFunction = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
  }

  return { generateUID }
}
