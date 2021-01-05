/*
Copyright 2021 Tom Peters

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
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