/*
Copyright 2021 Tom Peters

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

const cache = {}

// inspired by https://stackoverflow.com/a/19366389
export default (color) => {
    if (cache[color]) {
        return cache[color]
    }

    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1

    const ctx = canvas.getContext('2d')

    ctx.fillStyle = 'black'
    ctx.fillStyle = color
    const computedFillStyle = ctx.fillStyle

    ctx.fillStyle = 'white'
    ctx.fillStyle = color

    if (ctx.fillStyle !== computedFillStyle) {
        throw new Error(`invalid color ${color}`)
    }

    ctx.fillRect(0, 0, 1, 1)
    const data = [...ctx.getImageData(0, 0, 1, 1).data]
    cache[color] = data
    return data
}