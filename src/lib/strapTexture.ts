// Satu ubin tali: lebar 192px (melintang tali) x 1280px (sepanjang tali), diulang oleh Lanyard.
// Polos navy dengan jahitan dan satu paku keling, tanpa teks.
const ACROSS = 192
const ALONG = 1280

export async function makeStrapTexture(): Promise<string> {
  const canvas = document.createElement('canvas')
  canvas.width = ALONG
  canvas.height = ACROSS
  const c = canvas.getContext('2d')!

  c.fillStyle = '#2f7bf5'
  c.fillRect(0, 0, ALONG, ACROSS)

  // serat anyaman halus
  c.fillStyle = 'rgba(255,255,255,0.04)'
  for (let x = 0; x < ALONG; x += 4) c.fillRect(x, 0, 1, ACROSS)

  // jahitan putus-putus di kedua tepi
  c.fillStyle = 'rgba(255,255,255,0.22)'
  for (let x = 6; x < ALONG; x += 22) {
    c.fillRect(x, 16, 12, 3)
    c.fillRect(x, ACROSS - 19, 12, 3)
  }

  // paku keling perak di tengah ubin
  const g = c.createRadialGradient(ALONG / 2 - 6, ACROSS / 2 - 6, 2, ALONG / 2, ACROSS / 2, 22)
  g.addColorStop(0, '#f5f6f8')
  g.addColorStop(1, '#8c919c')
  c.fillStyle = g
  c.beginPath()
  c.arc(ALONG / 2, ACROSS / 2, 20, 0, Math.PI * 2)
  c.fill()

  return canvas.toDataURL('image/png')
}
