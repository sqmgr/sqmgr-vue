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

// Grid and square update events (used with EventBus)
export const GRID_UPDATED = 'grid-updated'
export const SQUARE_UPDATED = 'square-updated'
export const POOL_UPDATED = 'pool-updated'

// Auth events (used with global bus)
export const GUEST_JOIN = 'guestJoin'

// Modal events (used with ModalController bus)
export const MODAL_SHOW = 'show'
export const MODAL_ABORT = 'abort'
export const MODAL_HIDE = 'hide'
export const MODAL_HIDE_ALL = 'hideAll'
