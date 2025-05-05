export const apiVersion = '2024-03-20'
export const dataset = 'production'
export const projectId = 'r689038t'
export const useCdn = true

// Public read-only dataset configuration
export const readOnlyConfig = {
  projectId,
  dataset,
  apiVersion,
  useCdn,
  perspective: 'published'
}

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
