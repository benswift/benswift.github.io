import { spawn, exec } from "node:child_process"
import { promisify } from "node:util"

const execAsync = promisify(exec)

const PORT = 4173
const SITE_URL = `http://localhost:${PORT}`

async function waitForServer(url: string, timeout = 10000): Promise<void> {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    try {
      await fetch(url)
      return
    } catch {
      await new Promise((r) => setTimeout(r, 200))
    }
  }
  throw new Error(`Server at ${url} did not start within ${timeout}ms`)
}

async function main() {
  console.log("Building site...")
  await execAsync("npm run build")

  console.log("Starting preview server...")
  const server = spawn("npm", ["run", "preview"], {
    stdio: "ignore",
    detached: true,
  })

  try {
    await waitForServer(SITE_URL)
    console.log("Server ready, running unlighthouse...")

    await execAsync(
      `npx unlighthouse-ci --site ${SITE_URL} --build-static --no-cache`,
      { maxBuffer: 10 * 1024 * 1024 }
    )

    console.log("Done. Reports saved to .unlighthouse/")
  } finally {
    console.log("Stopping server...")
    process.kill(-server.pid!, "SIGTERM")
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
