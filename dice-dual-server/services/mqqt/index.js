const mqqtService = {
    assignControllerId: (id) => {
        if (mqqtState.idController === null) {
            mqqtState.idController = id
        }
    },
    removeControllerId: () => {
        if (mqqtState.idController !== null) {
            mqqtState.idController = null
        }
    },
    hasUserUseController: () => {
        return mqqtState.idController !== null
    },
    getCurrentId: () => {
        return mqqtState.idController
    },
    getInfo: () => {
        return mqqtState
    },
    setState: (state) => {
        mqqtState.isOnline = state
    },
}
const mqqtState = {
    idController: null,
    isOnline: false,
}
export { mqqtService, mqqtState }
