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

export default text => {
    const input = document.body.appendChild(document.createElement('input'))
    input.value = text
    input.style.position = 'absolute'
    input.style.border = 'none'
    input.style.left = '-99999px'
    input.style.top = document.documentElement.scrollTop + 'px'
    input.setAttribute('readonly', '')
    input.select()
    input.setSelectionRange(0, 9999999)
    document.execCommand('copy')
    input.remove()
}