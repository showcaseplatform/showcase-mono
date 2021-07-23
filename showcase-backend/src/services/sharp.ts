// API: https://sharp.pixelplumbing.com/api-resize
import sharp from 'sharp'

interface ResizeImage {
  buffer: Buffer
  width: number
  height: number
}

export const resizeImageWithSharp = async ({
  buffer,
  width,
  height,
}: ResizeImage): Promise<Buffer> => {
  return await sharp(buffer)
    .resize({ width, height, fit: 'inside', position: 'center', withoutEnlargement: true })
    .toBuffer()
}
