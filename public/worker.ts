let state: 'idle' | 'rendering' | 'stopping' = 'idle'

self.addEventListener('message', (msg) => {
  msg = msg.data

  if (msg.type === 'render') {
    let data!: {
      color: { r: number, g: number, b: number },
      position: { x: number, y: number },

      getColor: (x: number, y: number) => { r: number, g: number, b: number }
    }

    for (let i = 0; i < msg.data; i += 4) {
      if (state === 'stopping') {
        state = 'idle'

        return
      }

      data.color = { r: msg.data[i], g: msg.data[i + 1], b: msg.data[i + 2] }
      data.position = { x: Math.trunc(i % msg.data.width), y: Math.trunc(i / msg.data.width) }
    }
  }
})
