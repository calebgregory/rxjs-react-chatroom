import consola from 'consola'

export const logger = (namespace: string) => {
  return consola.withTag(namespace)
}