import express, { Express, Request, Response, Router } from "express";
import admin from "./routes/admin_aggregator";
import login from "./routes/login_router";
import users from "./routes/users_aggregator"
import cors, { CorsOptions } from "cors"
import cookieParser from "cookie-parser";

const corsOpttion: CorsOptions = {
    credentials: true,
    origin: ["http://localhost:3000", "https://mbr.ikhsanmajid.my.id", "http://10.42.0.1:3000", "http://10.42.0.243:3000"]
}

const app: Express = express()
const port: number = 3001

app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOpttion))

app.get("/", (req: Request, res: Response) => {
    res.send("It Works!")
})

app.get("/time", (req: Request, res: Response) => {
    res.json({ time: new Date().toISOString() })
})

app.use("/login", login)
app.use("/admin", admin)
app.use("/users", users)

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})