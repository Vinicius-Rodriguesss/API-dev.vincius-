import { Router } from "express";
import promptsRoutes from "../module/AI/AIroutes.js";
import portfolioRoutes from "../module/Portfolio/Portfolioroutes.js";

const router = Router();

router.use(promptsRoutes);
router.use(portfolioRoutes);

export default router;
