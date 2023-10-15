import Api from '../baseFetch'
const api = Api()
const controller = ''
const mqqt = () => {
    return {
        openLight: () => {
            return api.get('openLight')!
        },
        closeLight: () => {
            return api.get('closeLight')!
        },
    }
}
export default mqqt
