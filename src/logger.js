/*
Copyright 2020 Tom Peters

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

const logger = (() => {
    if (!import.meta.env.DEV) {
        return () => {}
    }

    const styles = [
        'background-color: #4caf50',
        'border-radius: 3px',
        'color: #fff',
        'font-weight: bold',
        'padding: 2px 10px',
        'text-transform: uppercase',
    ].join(';')

    return msg => {
        console.log('%csqmgr', styles, msg)
    }
})()

export default logger