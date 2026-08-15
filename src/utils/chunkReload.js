/*
Copyright 2019 Tom Peters

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

/*
When a new version is deployed, the hashed chunk filenames change and the old
ones are removed from the server. A tab that was left open (e.g. the machine
went to sleep) is still running the previous build, so the lazy `import()` for
a route resolves to a URL that now 404s. Vue Router surfaces that as a
navigation error and the click appears to do nothing.

Recovering means doing a full page load of the target so the browser picks up
the current index.html and its chunks.
*/

const STORAGE_KEY = 'chunkReloadPath'

// Browsers all word this differently.
const MESSAGE_PATTERNS = [
    /failed to fetch dynamically imported module/i, // Chrome, Edge
    /error loading dynamically imported module/i,   // Firefox
    /importing a module script failed/i,            // Safari
    /unable to preload css/i,                       // Vite's preload helper
]

const isDynamicImportError = error => {
    const message = error?.message || ''
    return MESSAGE_PATTERNS.some(pattern => pattern.test(message))
}

// Only reload once per target. If the fresh build still can't load the chunk,
// the problem isn't a stale bundle and reloading again would just loop.
const alreadyReloadedFor = path => {
    try {
        return sessionStorage.getItem(STORAGE_KEY) === path
    } catch {
        return false
    }
}

const markReloadFor = path => {
    try {
        sessionStorage.setItem(STORAGE_KEY, path)
    } catch {
        // Private browsing, quota, etc. Reloading unguarded is still better
        // than leaving the user on a page where links don't work.
    }
}

const clearReloadMark = () => {
    try {
        sessionStorage.removeItem(STORAGE_KEY)
    } catch {
        // no-op
    }
}

export default router => {
    router.onError((error, to) => {
        if (!isDynamicImportError(error)) {
            return
        }

        if (alreadyReloadedFor(to.fullPath)) {
            console.error('Chunk still missing after reload:', error)
            return
        }

        markReloadFor(to.fullPath)
        window.location.assign(to.fullPath)
    })

    router.afterEach(() => clearReloadMark())
}
