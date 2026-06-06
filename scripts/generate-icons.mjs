/**
 * Gera ícones PNG placeholder para o PWA usando apenas módulos built-in do Node.js.
 * Execute: node scripts/generate-icons.mjs
 */
import { deflateSync } from 'zlib'
import { writeFileSync, mkdirSync, existsSync } from 'fs'

// CRC32 para chunks PNG
const CRC_TABLE = new Uint32Array(256)
for (let i = 0; i < 256; i++) {
  let c = i
  for (let j = 0; j < 8; j++) c = (c & 1) ? 0xEDB88320 ^ (c >>> 1) : c >>> 1
  CRC_TABLE[i] = c
}

function crc32(buf) {
  let crc = 0xFFFFFFFF
  for (const byte of buf) crc = CRC_TABLE[(crc ^ byte) & 0xFF] ^ (crc >>> 8)
  return (crc ^ 0xFFFFFFFF) >>> 0
}

function pngChunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii')
  const len = Buffer.allocUnsafe(4)
  len.writeUInt32BE(data.length, 0)
  const crcInput = Buffer.concat([typeBytes, data])
  const crcBuf = Buffer.allocUnsafe(4)
  crcBuf.writeUInt32BE(crc32(crcInput), 0)
  return Buffer.concat([len, typeBytes, data, crcBuf])
}

/**
 * Cria um PNG com o design do waveSX:
 *   - Fundo escuro (#060810)
 *   - Faixa cyan no fundo (oceano) com wave suave
 *   - Ponto branco central (sol)
 */
function createIcon(size) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  const ihdr = Buffer.allocUnsafe(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8  // bit depth
  ihdr[9] = 2  // color type: RGB
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0

  // Cores
  const BG  = [6, 8, 16]        // #060810 — fundo escuro
  const CYN = [6, 214, 232]     // #06D6E8 — cyan/onda
  const PRP = [167, 139, 250]   // #A78BFA — roxo/aurora
  const WHT = [230, 245, 255]   // branco suave — sol

  const raw = Buffer.allocUnsafe(size * (1 + size * 3))

  const cx = size / 2
  const cy = size / 2
  const sunR = size * 0.08      // raio do sol
  const waveY = size * 0.65     // linha base da onda

  for (let y = 0; y < size; y++) {
    const rowStart = y * (1 + size * 3)
    raw[rowStart] = 0 // filter: None

    for (let x = 0; x < size; x++) {
      const px = rowStart + 1 + x * 3

      // Distância ao centro do sol
      const dx = x - cx * 0.5
      const dy = y - cy * 0.3
      const distSun = Math.sqrt(dx * dx + dy * dy)

      // Onda senoidal
      const waveOffset = Math.sin((x / size) * Math.PI * 3) * size * 0.04
      const isWave = y >= waveY + waveOffset

      if (distSun <= sunR) {
        // Sol
        raw[px] = WHT[0]; raw[px+1] = WHT[1]; raw[px+2] = WHT[2]
      } else if (isWave) {
        // Região do oceano — cyan
        const depth = (y - (waveY + waveOffset)) / (size - waveY)
        raw[px]   = Math.round(CYN[0] * (1 - depth * 0.4))
        raw[px+1] = Math.round(CYN[1] * (1 - depth * 0.2))
        raw[px+2] = Math.round(CYN[2] * (1 - depth * 0.1))
      } else {
        // Céu — gradiente do roxo ao escuro
        const t = y / waveY
        raw[px]   = Math.round(BG[0] + (PRP[0] - BG[0]) * t * 0.3)
        raw[px+1] = Math.round(BG[1] + (PRP[1] - BG[1]) * t * 0.15)
        raw[px+2] = Math.round(BG[2] + (PRP[2] - BG[2]) * t * 0.4)
      }
    }
  }

  const compressed = deflateSync(raw, { level: 6 })

  return Buffer.concat([
    sig,
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', compressed),
    pngChunk('IEND', Buffer.alloc(0)),
  ])
}

const dir = 'public/icons'
if (!existsSync(dir)) mkdirSync(dir, { recursive: true })

writeFileSync(`${dir}/icon-192.png`, createIcon(192))
writeFileSync(`${dir}/icon-512.png`, createIcon(512))
writeFileSync(`${dir}/apple-touch-icon.png`, createIcon(180))
console.log('✓ Ícones gerados em public/icons/')
