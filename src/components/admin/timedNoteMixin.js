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

const NOTE_DURATION_MS = 6000

// A short success note that clears itself after a few seconds. Components
// render `note` and call `showNote(text)` after an action succeeds.
export default {
    data() {
        return {
            note: null,
            noteTimer: null,
        }
    },
    beforeUnmount() {
        this.clearNote()
    },
    methods: {
        showNote(text, duration = NOTE_DURATION_MS) {
            this.clearNoteTimer()
            this.note = text
            this.noteTimer = setTimeout(() => {
                this.note = null
                this.noteTimer = null
            }, duration)
        },

        clearNote() {
            this.clearNoteTimer()
            this.note = null
        },

        clearNoteTimer() {
            if (this.noteTimer) {
                clearTimeout(this.noteTimer)
                this.noteTimer = null
            }
        },
    },
}
