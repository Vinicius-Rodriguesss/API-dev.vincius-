import { Router } from "express";
import { getLatestPortfolio, listPortfolioPosts } from "./Portfoliocontroller.js";

const router = Router();

router.get("/portfolio/posts", listPortfolioPosts);
router.get("/portfolio/posts/latest", getLatestPortfolio);

export default router;
