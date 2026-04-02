import { Router } from "express"
import { listPrompts } from "./AIcontroller.js"

const router = Router()

router.get("/prompts", listPrompts)

export default router