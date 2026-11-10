import { profile } from '../data/profile'

// Rasio muka kartu = CARD_SIZES.portrait di Lanyard.tsx (1.45 x 2.35); ubah keduanya bersama
const W = 1024
const H = Math.round((W * 2.35) / 1.45)
const NAVY = '#0d1626'
const BLUE = '#2f7bf5'
const INK = '#0b1424'
const PHOTO_BG = '#dfe2e6'
const font = (w: number, s: number) => `${w} ${s}px "Plus Jakarta Sans", system-ui, sans-serif`
const body = (w: number, s: number) => `${w} ${s}px "Plus Jakarta Sans", system-ui, sans-serif`

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((ok, fail) => {
    const img = new Image()
    img.onload = () => ok(img)
    img.onerror = fail
    img.src = src
  })

function canvas() {
  const el = document.createElement('canvas')
  el.width = W
  el.height = H
  return [el, el.getContext('2d')!] as const
}

const loadFonts = () => Promise.all([document.fonts.load(font(700, 90)), document.fonts.load(body(500, 30))])

// Muka depan: foto di blok abu-abu, panel putih dengan lekukan, nama besar, peran dan nomor ID kecil
export async function makeIdCardFace(): Promise<string> {
  const [photo] = await Promise.all([loadImage(profile.photo), loadFonts()])
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

  // foto dilebur ke latar abu-abu (latar putih foto ikut jadi abu-abu)
  c.save()
  c.clip()
  c.globalCompositeOperation = 'multiply'
  const k = Math.max(W / photo.width, right / photo.height)
  c.drawImage(photo, (W - photo.width * k) / 2, 0, photo.width * k, photo.height * k)
  c.restore()

  // nama besar dua baris
  c.fillStyle = INK
  c.textBaseline = 'alphabetic'
  c.font = font(700, 96)
  c.letterSpacing = '-3px'
  const [first, last] = profile.name.split(' ')
  c.fillText(first, 72, 1250)
  c.fillText(last, 72, 1350)

  // peran dan nomor ID
  c.letterSpacing = '0px'
  c.font = body(500, 34)
  c.fillStyle = '#5a6272'
  c.fillText(profile.role, 72, H - 90)
  c.textAlign = 'right'
  c.fillText(profile.idCard.id, W - 72, H - 90)

  return el.toDataURL('image/webp', 0.92)
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
  c.font = font(700, 340)
  c.letterSpacing = '-10px'
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

  return el.toDataURL('image/webp', 0.92)
}
