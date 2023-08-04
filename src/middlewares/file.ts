import { Request } from 'express'
import multer, { diskStorage } from 'multer'
import { join } from 'path'

const PATH_STORAGE = `${join(__dirname, '..', 'uploads')}`

const storage = diskStorage({
  destination(_req: Request, _file: Express.Multer.File, cb: any) {
    cb(null, PATH_STORAGE)
  },
  filename(_req: Request, file: Express.Multer.File, cb: any) {
    cb(null, file.fieldname + '-' + Date.now() + file.originalname)
  }
})

const upload = multer({ storage })

export const multerMiddleware = upload.single('thumbnail')
