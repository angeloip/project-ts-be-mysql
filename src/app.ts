import 'dotenv/config'
import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { router } from './routes'
import { checkDBConnection } from './config/connection'


const PORT = process.env.PORT || 5000
const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())

checkDBConnection()

app.use(router)

app.use((error: any, _req: Request, res: Response, _next: NextFunction) => {
	console.log('Error name: ', error.name)
	console.log('Error message: ', error.message)
	console.log('Error: ', error)
	return res.status(500).json({ msg: error.message })
})

app.get('/', (_req, res) => {
	res.send('Server')
})

app.listen(PORT, () => {
	console.log(`El servidor está corriendo correctamente.`)
})
