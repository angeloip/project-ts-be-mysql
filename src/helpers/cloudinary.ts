import { v2 } from 'cloudinary'

v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
})

export const uploadProductPicture = async (filePath: string) => {
  return await v2.uploader.upload(filePath, {
    folder: 'product'
  })
}

export const deleteProductPicture = async (id: string) => {
  return await v2.uploader.destroy(id)
}
