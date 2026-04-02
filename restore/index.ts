import { prisma } from "../lib/prisma.js"
import readline from "readline"

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

async function deleteAll() {
  rl.question("⚠️ Digite 'CONFIRMAR' para apagar todos os dados: ", async (answer) => {
    if (answer !== "CONFIRMAR") {
      console.log("❌ Operação cancelada.")
      rl.close()
      return
    }

    await prisma.prompt.deleteMany()

    console.log("✅ Todos os dados foram apagados com sucesso.")
    rl.close()
  })
}

deleteAll()

// npx tsx restore/index.ts 