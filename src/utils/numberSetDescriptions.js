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

export function getNumberSetDescription(key) {
    const descriptions = {
        'standard': 'Drawn numbers remain the same for the whole game',
        '123f': 'Different numbers for first, second and third quarters and the final score',
        'hf': 'Different numbers for first half and final',
        '1234': 'Different numbers for all four quarters. Ignores overtime',
        'h4': 'Different numbers for first half and second half. Ignores overtime',
    }
    return descriptions[key] || ''
}
