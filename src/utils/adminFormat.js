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

import Common from "@/common"
import ResponseError from "@/models/ResponseError"

// Shared formatting helpers for the site-admin pages so every table and
// stat tile renders dates, numbers and errors the same way.

const ZERO_YEAR_CUTOFF = 1

function isValidDate(value) {
    if (!value) return false
    const date = new Date(value)
    return !isNaN(date.getTime()) && date.getFullYear() > ZERO_YEAR_CUTOFF
}

export function formatDate(value) {
    if (!isValidDate(value)) return '-'
    return new Date(value).toLocaleString(undefined, Common.DateTimeOptions)
}

export function formatNumber(num) {
    if (num === undefined || num === null) return '0'
    return Number(num).toLocaleString()
}

export function formatPercent(num, digits = 1) {
    if (num === undefined || num === null || isNaN(num)) return '-'
    return `${Number(num).toFixed(digits)}%`
}

export function formatDecimal(num, digits = 1) {
    if (num === undefined || num === null || isNaN(num)) return '-'
    return Number(num).toFixed(digits)
}

// Seconds between two RFC3339 timestamps rendered as "12s" / "3m 4s".
export function formatDuration(startedAt, completedAt) {
    if (!isValidDate(startedAt) || !isValidDate(completedAt)) return '-'
    const seconds = Math.max(0, Math.round((new Date(completedAt) - new Date(startedAt)) / 1000))
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const rest = seconds % 60
    if (minutes < 60) return `${minutes}m ${rest}s`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ${minutes % 60}m`
}

// Account type for a user store ("auth0" is a registered account).
export function formatStoreLabel(store) {
    return store === 'auth0' ? 'Registered' : 'Guest'
}

// "just now", "12 minutes ago", "3 hours ago", "2 days ago"; falls back to
// the full date past a week so old runs are not described vaguely.
export function formatRelative(value, now = new Date()) {
    if (!isValidDate(value)) return '-'
    const seconds = Math.round((now - new Date(value)) / 1000)
    if (seconds < 45) return 'just now'
    const minutes = Math.round(seconds / 60)
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
    const hours = Math.round(minutes / 60)
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
    const days = Math.round(hours / 24)
    if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`
    return formatDate(value)
}

export function formatUserLabel(id, email, store) {
    if (email) return email
    if (!id) return '-'
    if (store === 'sqmgr') return `Guest #${id}`
    return `User #${id}`
}

// Human label for a sports event status, preferring ESPN's own detail text
// ("Halftime", "End of 3rd") when present.
export function formatEventStatus(status, statusDetail = '') {
    if (statusDetail) return statusDetail
    switch (status) {
        case 'scheduled': return 'Scheduled'
        case 'in_progress': return 'In Progress'
        case 'final': return 'Final'
        default: return status || '-'
    }
}

// Badge class for a sports event status.
export function eventStatusClass(status) {
    switch (status) {
        case 'final': return 'archived'
        case 'in_progress': return 'active'
        default: return 'neutral'
    }
}

export function getErrorMessage(err) {
    if (err instanceof ResponseError) {
        return err.message || 'The request failed.'
    }
    return 'An unexpected error occurred. Please try again.'
}

// YYYY-MM-DD for a Date, using the UTC calendar day to match the API.
export function toISODate(date) {
    return date.toISOString().slice(0, 10)
}

export function isISODate(value) {
    return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
}

export default {
    formatDate,
    formatNumber,
    formatPercent,
    formatDecimal,
    formatDuration,
    formatStoreLabel,
    formatUserLabel,
    formatEventStatus,
    eventStatusClass,
    getErrorMessage,
    toISODate,
    isISODate,
}
