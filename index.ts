import express, { Express, Request, Response, Router } from "express";
import admin from "./routes/admin_aggregator";
import login from "./routes/login_router";
import users from "./routes/users_aggregator"
import cors, { CorsOptions } from "cors"
import cookieParser from "cookie-parser";
import dotenv from 'dotenv'

dotenv.config()

const corsOpttion: CorsOptions = {
    credentials: true,
    origin: ["http://localhost:3000", "http://localhost:450", "https://konimex:450"]
}

const app: Express = express()
const port: number = 3001

app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOpttion))

const router: Router = Router()

router.get("/", (req: Request, res: Response) => {
    res.send("It Works!")
})

router.get("/time", (req: Request, res: Response) => {
    res.json({ time: new Date().toISOString() })
})

router.use("/login", login)
router.use("/admin", admin)
router.use("/users", users)

app.use("/mbr_backend", router)

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})