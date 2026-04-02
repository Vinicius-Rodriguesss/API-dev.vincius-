import { Router } from "express"
import promptsRoutes from "../module/AI/AIroutes.js"

const router = Router()

router.use(promptsRoutes)

export default router