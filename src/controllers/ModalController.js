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

import Vue from 'vue'
import Error from '@/components/Error'
import Prompt from "@/components/Prompt";

const bus = new Vue()

const obj = {
    bus,
    show() {
        bus.$emit('show', ...arguments)
    },
    abort() {
        bus.$emit('abort')
    },
    hide() {
        bus.$emit('hide')
    },
    hideAll() {
        bus.$emit('hideAll')
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