// Pixel
export interface Pixel {
  color: { r: number, g: number, b: number },
  size: { width: number, height: number },
  position: { x: number, y: number },

  getColor: (x: number, y: number) => undefined | { r: number, g: number, b: number }
} 
