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

// Cells starting with these characters are evaluated as formulas by
// spreadsheet apps, so they are prefixed with a quote to keep them as text.
const FORMULA_PREFIX = /^[=+\-@\t\r]/

export const csvCell = value => {
    let cell = String(value ?? '')
    if (FORMULA_PREFIX.test(cell)) {
        cell = `'${cell}`
    }
    if (/[",\r\n]/.test(cell)) {
        cell = `"${cell.replace(/"/g, '""')}"`
    }
    return cell
}

export const toCSV = rows => rows.map(row => row.map(csvCell).join(',')).join('\r\n') + '\r\n'

export default (filename, rows) => {
    const blob = new Blob([toCSV(rows)], {type: 'text/csv;charset=utf-8'})
    const url = URL.createObjectURL(blob)
    const link = document.body.appendChild(document.createElement('a'))
    link.href = url
    link.download = filename
    link.click()
    link.remove()
    setTimeout(() => URL.revokeObjectURL(url), 0)
}
