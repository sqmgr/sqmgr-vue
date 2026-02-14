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

import mitt from 'mitt'
import Error from '@/components/ui/Error'
import Prompt from "@/components/ui/Prompt";
import { MODAL_SHOW, MODAL_ABORT, MODAL_HIDE, MODAL_HIDE_ALL } from "@/constants/events";

const bus = mitt()

const obj = {
    bus,
    show() {
        bus.emit(MODAL_SHOW, [...arguments])
    },
    abort() {
        bus.emit(MODAL_ABORT)
    },
    hide() {
        bus.emit(MODAL_HIDE)
    },
    hideAll() {
        bus.emit(MODAL_HIDE_ALL)
    },
    showPrompt(title, description, opts = {}) {
        const confirmAction = typeof(opts.action) === 'function' ? opts.action : () => {}
        const abortedAction = typeof(opts.abortedAction) === 'function' ? opts.abortedAction : () => {}
        obj.show(title, Prompt, {
            title,
            description,
            dismissButton: opts.dismissButton,
            actionButton: opts.actionButton,
            cancelButton: opts.cancelButton,
            warning: opts.warning,
            isDestructive: opts.isDestructive,
        }, {
            'action-was-clicked': confirmAction,
            'cancel-was-clicked': () => {
                if (typeof(opts.cancelAction) === 'function') {
                    opts.cancelAction()
                }

                obj.hide()
            },
            'modal-aborted': abortedAction,
        })
    },
    showError(err) {
        obj.show('Error', Error, {
            error: err,
        })
    }
}

export default obj
