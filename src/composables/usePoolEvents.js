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

import { onUnmounted, ref } from 'vue'
import accessTokenManager from '@/models/accessTokenManager'
import EventBus from '@/models/EventBus'
import { GRID_UPDATED, SQUARE_UPDATED, POOL_UPDATED } from '@/constants/events'

const baseURL = import.meta.env.VITE_API_URL

const sseEventMap = {
    'square_updated': SQUARE_UPDATED,
    'grid_updated': GRID_UPDATED,
    'pool_updated': POOL_UPDATED,
}

/**
 * Composable that opens an SSE connection to receive real-time pool updates.
 * Incoming server events are mapped to EventBus emissions so existing
 * component listeners (Pool.vue, PoolGrid.vue) react automatically.
 *
 * @param {string} poolToken - The pool token to subscribe to
 * @returns {{ connected: import('vue').Ref<boolean>, close: () => void }}
 */
export function usePoolEvents(poolToken) {
    const connected = ref(false)
    let eventSource = null

    async function connect() {
        if (eventSource) return

        let token
        try {
            token = await accessTokenManager.getAccessToken()
        } catch {
            return
        }

        const url = `${baseURL}/pool/${poolToken}/events?access_token=${encodeURIComponent(token)}`
        eventSource = new EventSource(url)

        eventSource.onopen = () => {
            connected.value = true
        }

        eventSource.onerror = () => {
            connected.value = false
            // EventSource auto-reconnects; we just track connection state
        }

        // Listen for each event type
        for (const [sseEvent, busEvent] of Object.entries(sseEventMap)) {
            eventSource.addEventListener(sseEvent, () => {
                EventBus.emit(busEvent, true)
            })
        }
    }

    function close() {
        if (eventSource) {
            eventSource.close()
            eventSource = null
            connected.value = false
        }
    }

    connect()

    onUnmounted(() => {
        close()
    })

    return { connected, close }
}
