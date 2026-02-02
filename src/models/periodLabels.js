/*
Copyright 2019 Tom Peters

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
