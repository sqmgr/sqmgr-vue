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

import sqmgrConfig from './sqmgrConfig'

let configPromise = null

function getConfig() {
    if (!configPromise) {
        configPromise = sqmgrConfig()
    }
    return configPromise
}

/**
 * Get the short label for a period (async, fetches config if needed)
 * @param {string} period - The period key (e.g., 'q1', 'half', 'final')
 * @returns {Promise<string>} The short label (e.g., '1st', 'Half', 'Final')
 */
export async function getShortLabel(period) {
    const config = await getConfig()
    return config?.numberSetTypeInfos?.[period]?.label || period
}

/**
 * Get the long label for a period (async, fetches config if needed)
 * @param {string} period - The period key (e.g., 'q1', 'half', 'final')
 * @returns {Promise<string>} The long label (e.g., '1st Quarter', 'Halftime', 'Final')
 */
export async function getLongLabel(period) {
    const config = await getConfig()
    return config?.numberSetTypeInfos?.[period]?.longLabel || period
}

/**
 * Get the short label for a period (synchronous, requires config to be passed)
 * @param {Object} config - The sqmgr config object
 * @param {string} period - The period key (e.g., 'q1', 'half', 'final')
 * @returns {string} The short label (e.g., '1st', 'Half', 'Final')
 */
export function getShortLabelSync(config, period) {
    return config?.numberSetTypeInfos?.[period]?.label || period
}

/**
 * Get the long label for a period (synchronous, requires config to be passed)
 * @param {Object} config - The sqmgr config object
 * @param {string} period - The period key (e.g., 'q1', 'half', 'final')
 * @returns {string} The long label (e.g., '1st Quarter', 'Halftime', 'Final')
 */
export function getLongLabelSync(config, period) {
    return config?.numberSetTypeInfos?.[period]?.longLabel || period
}

export default {
    getShortLabel,
    getLongLabel,
    getShortLabelSync,
    getLongLabelSync,
}
