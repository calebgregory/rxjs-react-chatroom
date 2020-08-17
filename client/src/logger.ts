export const logger = (namespace: string) => {
  return {
    ...console,
    debug: console.debug.bind(console, namespace),
    error: console.error.bind(console, namespace),
    info: console.info.bind(console, namespace),
    log: console.log.bind(console, namespace),
    warn: console.warn.bind(console, namespace),
    trace: console.trace.bind(console, namespace),
  }
}