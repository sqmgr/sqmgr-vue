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

import { ref } from 'vue'

export function usePaginatedFetch(fetchFn, perPage = 10, onError) {
    const data = ref(null)
    const loading = ref(true)
    const error = ref(null)
    const currentPage = ref(1)

    async function fetch(offset = 0) {
        loading.value = true
        error.value = null
        try {
            data.value = await fetchFn(offset, perPage)
            currentPage.value = Math.floor(offset / perPage) + 1
        } catch (err) {
            if (onError) {
                onError(err)
            } else {
                error.value = err.message || 'An unexpected error occurred.'
            }
        } finally {
            loading.value = false
        }
    }

    function goToPage(page) {
        fetch((page - 1) * perPage)
    }

    return { data, loading, error, currentPage, fetch, goToPage }
}
