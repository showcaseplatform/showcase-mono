import express, { Request } from 'express'
import multer, { FileFilterCallback } from 'multer'
import cors from 'cors'
import fs from 'fs'
import util from 'util'

import { loadFileStream, uploadFile } from './S3'

const imageServer = express()

imageServer.use(cors())
imageServer.use(express.json())
imageServer.use(express.urlencoded({ extended: true }))

const fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => void = (_, { mimetype }, cb) => {
  // ?: do a proper validation with fs-extra
  // ?: size check
  if (mimetype === "image/jpeg" || mimetype === "image/png") {
    cb(null, true)
  } else {
    cb(new Error("Only JPEG and PNG allowed."))
  }
}

const upload = multer({
  fileFilter,
  dest: 'temp/',
})

const deleteTempFile = util.promisify(fs.unlink)


imageServer.get('/badge/:key', (req, res) => {
  const key = req.params.key
  const downloadStream = loadFileStream(key)
  downloadStream.pipe(res)
})

imageServer.post('/upload-badge', upload.single('image'), async ({ file }, res) => {
  try {
    if (!file) {
      res.status(400).send({
        status: false,
        message: 'No file uploaded'
      })
    } else {
      // ?: resizing,
      // ?: create different reoslutions for the frontnd
      const result = await uploadFile(file)
      await deleteTempFile(file.path)

      res.send({
        status: true,
        message: '👍',
        data: {
          key: file.filename,
          path: `badgeType/${result.Key}`,
          mimetype: file.mimetype,
          size: file.size,
        }
      })

    }
  } catch (err) {
    res.status(500).send(err)
  }
})

export default imageServer

