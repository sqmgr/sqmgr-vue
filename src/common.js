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

export default {
    NewDateWithoutTimezone(date) {
        const dateObj = new Date(date)
        return new Date(dateObj.getTime() + dateObj.getTimezoneOffset() * 60 * 1000)
    },
    DateOptions: {
        month: 'long',
        year: 'numeric',
        day: 'numeric',
    },
    DateTimeOptions: {
        year: '2-digit',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    }
}