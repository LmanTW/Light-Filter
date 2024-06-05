// Wait Until
export async function waitUntil (callback: () => boolean): Promise<void> {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (callback()) {
        clearInterval(interval)

        resolve()
      }
    }, 50)
  })
}
