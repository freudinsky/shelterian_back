import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()
const PORT = process.env.PORT 

app.use(cors())
app.use(cookieParser())
app.use(express.json())

app.listen(PORT, console.log(`Server running on port ${PORT}`))