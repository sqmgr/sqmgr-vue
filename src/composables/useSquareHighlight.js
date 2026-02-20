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

import { reactive } from 'vue'

const state = reactive({
    primarySquare: null,
    highlightSquares: {},
    bulkMode: false,
    selectedSquares: new Set(),
})

export function useSquareHighlight() {
    function setPrimarySquare(data) {
        state.primarySquare = data
    }

    function setHighlightSquares(data) {
        state.highlightSquares = { ...data }
    }

    function toggleBulkMode() {
        state.bulkMode = !state.bulkMode
        if (!state.bulkMode) {
            state.selectedSquares = new Set()
        }
    }

    function toggleSquareSelection(id) {
        const next = new Set(state.selectedSquares)
        if (next.has(id)) {
            next.delete(id)
        } else {
            next.add(id)
        }
        state.selectedSquares = next
    }

    function clearSelection() {
        state.selectedSquares = new Set()
    }

    return {
        state,
        setPrimarySquare,
        setHighlightSquares,
        toggleBulkMode,
        toggleSquareSelection,
        clearSelection,
    }
}
