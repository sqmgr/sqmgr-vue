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

// mergeQuery returns a copy of the current route query with `params`
// applied. Empty values and values that `isDefault` reports as the default
// are removed so the URL only carries state that differs from the default.
export function mergeQuery(current, params, isDefault = () => false) {
    const query = { ...current }
    Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '' || isDefault(key, value)) {
            delete query[key]
        } else {
            query[key] = String(value)
        }
    })
    return query
}

// pushQuery navigates to the merged query when it actually changed.
export function pushQuery(router, route, params, isDefault, replace = false) {
    const query = mergeQuery(route.query, params, isDefault)
    if (JSON.stringify(query) === JSON.stringify(route.query)) return
    router[replace ? 'replace' : 'push']({ query }).catch(() => {})
}

export function pageFromQuery(query) {
    const page = parseInt(query.page, 10)
    return (isNaN(page) || page < 1) ? 1 : page
}
