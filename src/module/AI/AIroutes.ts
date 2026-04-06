import { Router } from "express";
import { getLatestPrompt, listPrompts } from "./AIcontroller.js";

const router = Router();

router.get("/prompts", listPrompts);
router.get("/prompts/latest", getLatestPrompt);

export default router;
