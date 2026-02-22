import { createServer } from 'node:http'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, extname } from 'node:path'
import { lookup } from 'mrmime'
import puppeteer from 'puppeteer'

const DIST = join(import.meta.dirname, '..', 'dist')
const PORT = 4173

const ROUTES = [
    '/',
    '/about',
    '/privacy',
    '/terms',
    '/cookies',
    '/release-notes',
    '/resources',
    '/resources/how-squares-work',
    '/resources/setting-up-a-pool',
    '/resources/linking-live-events-and-payouts',
    '/resources/multiple-games-and-rollover',
    '/resources/best-numbers-in-football-squares',
    '/resources/super-bowl-squares',
]

function startServer() {
    const fallback = readFileSync(join(DIST, 'index.html'))

    const server = createServer((req, res) => {
        const url = new URL(req.url, `http://localhost:${PORT}`)
        let filePath = join(DIST, url.pathname)

        let body
        try {
            body = readFileSync(filePath)
        } catch {
            // Try with index.html appended (directory)
            try {
                body = readFileSync(join(filePath, 'index.html'))
                filePath = join(filePath, 'index.html')
            } catch {
                // SPA fallback
                body = fallback
                filePath = join(DIST, 'index.html')
            }
        }

        const mime = lookup(extname(filePath)) || 'application/octet-stream'
        res.writeHead(200, { 'Content-Type': mime })
        res.end(body)
    })

    return new Promise((resolve) => {
        server.listen(PORT, () => {
            console.log(`Static server listening on http://localhost:${PORT}`)
            resolve(server)
        })
    })
}

async function prerender() {
    const server = await startServer()

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })

    try {
        for (const route of ROUTES) {
            const page = await browser.newPage()
            const url = `http://localhost:${PORT}${route}`
            console.log(`Rendering ${route} ...`)

            await page.goto(url, { waitUntil: 'networkidle0' })
            await page.waitForSelector('#app > *', { timeout: 10000 })

            const html = await page.content()

            if (route === '/') {
                writeFileSync(join(DIST, 'index.html'), html)
            } else {
                const dir = join(DIST, route)
                mkdirSync(dir, { recursive: true })
                writeFileSync(join(dir, 'index.html'), html)
            }

            console.log(`  -> wrote ${route === '/' ? 'dist/index.html' : `dist${route}/index.html`}`)
            await page.close()
        }
    } finally {
        await browser.close()
        server.close()
    }

    console.log('Pre-rendering complete.')
}

prerender().catch((err) => {
    console.error('Pre-rendering failed:', err)
    process.exit(1)
})
