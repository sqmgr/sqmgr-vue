/*
Copyright 2026 Tom Peters

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

import { ref, watch, onBeforeUnmount } from 'vue'

// useDebouncedSearch pairs a text input with a trimmed search term that only
// updates after the user stops typing. Bind `input` to the field and watch
// `search` to trigger a request.
export function useDebouncedSearch(delay = 300) {
    const input = ref('')
    const search = ref('')
    let timeout = null

    watch(input, value => {
        if (timeout) {
            clearTimeout(timeout)
        }
        timeout = setTimeout(() => {
            timeout = null
            const trimmed = value.trim()
            if (trimmed !== search.value) {
                search.value = trimmed
            }
        }, delay)
    })

    onBeforeUnmount(() => {
        if (timeout) {
            clearTimeout(timeout)
        }
    })

    return { input, search }
}
