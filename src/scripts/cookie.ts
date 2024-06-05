// Get A Cookie
export function getCookie (name: string): undefined | string {
  const data = document.cookie.split('; ').filter((chunk) => chunk.split('=')[0] === name)

  return (data.length > 0) ? data[0].split('=')[1] : undefined
}

// Set A Cookie
export function setCookie (name: string, value: string): void {
  document.cookie = `${name}=${value}`
}
