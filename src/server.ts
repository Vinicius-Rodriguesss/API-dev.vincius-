import express from "express";
import Routers from "./Routes/index.js"
import  Scheduling  from "../service/IA/postSchedule/index.js";
import cors from "cors"
const app = express()
const port = 3000


Scheduling()
app.use(cors())
app.use(express.json())
app.use('/', Routers)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
