import { profile } from '../data/profile'

// Rasio muka kartu = CARD_SIZES.portrait di Lanyard.tsx (1.45 x 2.35); ubah keduanya bersama
const W = 1024
const H = Math.round((W * 2.35) / 1.45)
const NAVY = '#0d1626'
const BLUE = '#2f7bf5'
const INK = '#0b1424'
const PHOTO_BG = '#dfe2e6'
const font = (w: number, s: number) => `${w} ${s}px "Geist Variable", system-ui, sans-serif`
const serif = (s: number) => `italic 400 ${s}px "Instrument Serif", Georgia, serif`
const body = font

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((ok, fail) => {
    const img = new Image()
    img.crossOrigin = 'anonymous' // foto dari Supabase Storage harus bisa dipakai di kanvas
    img.onload = () => ok(img)
    img.onerror = fail
    img.src = src
  })

// Digambar di 1024px agar detailnya tajam, lalu diperkecil ke 768px: tekstur lebih ringan untuk GPU laptop
function toTexture(el: HTMLCanvasElement) {
  const out = document.createElement('canvas')
  out.width = 768
  out.height = Math.round((el.height * 768) / el.width)
  out.getContext('2d')!.drawImage(el, 0, 0, out.width, out.height)
  return out.toDataURL('image/webp', 0.9)
}

function canvas() {
  const el = document.createElement('canvas')
  el.width = W
  el.height = H
  return [el, el.getContext('2d')!] as const
}

const loadFonts = () => Promise.all([document.fonts.load(font(700, 90)), document.fonts.load(serif(90)), document.fonts.load(body(500, 30))])

// Muka depan: foto di blok abu-abu, panel putih dengan lekukan, nama besar, peran dan nomor ID kecil
export async function makeIdCardFace(photoUrl: string): Promise<string> {
  const [photo] = await Promise.all([loadImage(photoUrl), loadFonts()])
  const [el, c] = canvas()

  c.fillStyle = '#ffffff'
  c.fillRect(0, 0, W, H)

  // blok foto: tepi bawahnya menurun di kanan lewat lekukan S
  const left = 1010, right = 1130, notchStart = 520, notchEnd = 680
  c.beginPath()
  c.moveTo(0, 0)
  c.lineTo(W, 0)
  c.lineTo(W, right)
  c.lineTo(notchEnd + 90, right)
  c.bezierCurveTo(notchEnd, right, notchEnd, left, notchEnd - 90, left)
  c.lineTo(notchStart - 90, left)
  c.lineTo(0, left)
  c.closePath()
  c.fillStyle = PHOTO_BG
  c.fill()

  // foto diperkecil dan rata bawah agar kepala punya ruang; tepinya dipudarkan lalu dilebur ke abu-abu
  const ps = W * 0.88
  const soft = document.createElement('canvas')
  soft.width = soft.height = ps
  const sc = soft.getContext('2d')!
  sc.drawImage(photo, 0, 0, ps, ps)
  sc.globalCompositeOperation = 'destination-in'
  const fadeX = sc.createLinearGradient(0, 0, ps, 0)
  fadeX.addColorStop(0, 'transparent')
  fadeX.addColorStop(0.1, '#000')
  fadeX.addColorStop(0.9, '#000')
  fadeX.addColorStop(1, 'transparent')
  sc.fillStyle = fadeX
  sc.fillRect(0, 0, ps, ps)
  const fadeY = sc.createLinearGradient(0, 0, 0, ps)
  fadeY.addColorStop(0, 'transparent')
  fadeY.addColorStop(0.08, '#000')
  sc.fillStyle = fadeY
  sc.fillRect(0, 0, ps, ps)
  c.save()
  c.clip()
  c.globalCompositeOperation = 'multiply'
  c.drawImage(soft, (W - ps) / 2, right - ps, ps, ps)
  c.restore()

  // nama besar dua baris
  c.fillStyle = INK
  c.textBaseline = 'alphabetic'
  c.font = font(700, 118)
  c.letterSpacing = '-5px'
  const [first, last] = profile.name.split(' ')
  c.fillText(first, 72, 1250)
  c.fillStyle = BLUE
  c.font = serif(142)
  c.fillText(last, 72, 1385)

  // peran dan nomor ID
  c.letterSpacing = '0px'
  c.font = body(500, 34)
  c.fillStyle = '#5a6272'
  c.fillText(profile.role, 72, H - 90)
  c.textAlign = 'right'
  c.fillText(profile.idCard.id, W - 72, H - 90)

  return toTexture(el)
}

// Muka belakang: navy polos dengan kata merek besar yang dibaca vertikal
export async function makeIdCardBack(): Promise<string> {
  await loadFonts()
  const [el, c] = canvas()
  c.fillStyle = NAVY
  c.fillRect(0, 0, W, H)

  c.save()
  c.translate(W / 2 + 40, H / 2)
  c.rotate(-Math.PI / 2)
  c.fillStyle = '#ffffff'
  c.font = serif(420)
  c.letterSpacing = '-8px'
  c.textAlign = 'center'
  c.textBaseline = 'middle'
  c.fillText(profile.name.split(' ')[0], 0, 0)
  c.restore()

  c.fillStyle = BLUE
  c.fillRect(72, 90, 120, 14)
  c.fillStyle = '#9fb0d4'
  c.font = body(500, 34)
  c.textBaseline = 'alphabetic'
  c.fillText(profile.idCard.tag, 72, H - 90)

  return toTexture(el)
}
