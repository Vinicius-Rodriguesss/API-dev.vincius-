import express from "express";
import Routers from "./Routes/index.js"
import Scheduling from "../service/postSchedule/index.js";
import cors from "cors"
import agendarPostagemLinkedin from "../service/LinkedinScheduler/index.js";
import { validateApiKey } from "./middleware/apiKey.js";
const app = express()


const port = Number(process.env.PORT || 5001);

Scheduling()
agendarPostagemLinkedin();


app.use(cors())
app.use(express.json())
app.get("/health", (req, res) => {
  return res.json({ status: "ok" })
})
app.use(validateApiKey)
app.use('/', Routers)

app.listen(port, () => {
  console.log(`Servido rodando...`)
})
