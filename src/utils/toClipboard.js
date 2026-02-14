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

export default text => {
    const input = document.body.appendChild(document.createElement('input'))
    input.value = text
    input.style.position = 'absolute'
    input.style.border = 'none'
    input.style.left = '-99999px'
    input.style.top = document.documentElement.scrollTop + 'px'
    input.setAttribute('readonly', '')
    input.select()
    input.setSelectionRange(0, 9999999)
    document.execCommand('copy')
    input.remove()
}