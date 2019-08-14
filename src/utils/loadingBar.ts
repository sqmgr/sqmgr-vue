import bus from './bus'
export default {
    start() {
       bus.$emit('loading-start')
    },
    stop() {
        bus.$emit('loading-done')
    }
}