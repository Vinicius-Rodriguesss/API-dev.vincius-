// cd src/module/AI
// npx tsx src/module/AI/AIservice.ts
import { prisma } from "../../../lib/prisma.js"

const getAllResultPrompt = async () => {
const users = await prisma.prompt.findMany()
return users;
}

export default getAllResultPrompt;
