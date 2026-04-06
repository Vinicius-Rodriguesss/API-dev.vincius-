import express from "express";
import Routers from "./Routes/index.js"
import Scheduling from "../service/postSchedule/index.js";
import cors from "cors"
import agendarPostagemLinkedin from "../service/LinkedinScheduler/index.js";
const app = express()


const port = process.env.PORT;

Scheduling()
agendarPostagemLinkedin();


app.use(cors())
app.use(express.json())
app.use('/', Routers)

app.listen(port, () => {
  console.log(`Servido rodando...`)
})
