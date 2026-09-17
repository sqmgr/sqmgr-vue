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

// debounce returns a function that runs `fn` once `delay` ms have passed
// without another call. The returned function has a `cancel()` method so a
// component can drop a pending call when it unmounts.
export function debounce(fn, delay = 300) {
    let timeout = null

    const debounced = function (...args) {
        if (timeout) {
            clearTimeout(timeout)
        }
        timeout = setTimeout(() => {
            timeout = null
            fn.apply(this, args)
        }, delay)
    }

    debounced.cancel = () => {
        if (timeout) {
            clearTimeout(timeout)
            timeout = null
        }
    }

    return debounced
}

export default debounce
