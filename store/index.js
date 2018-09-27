export const strict = false
export const state = () => ({
    user: null,
    setting: null,
})
export const mutations = {
    setUser(state, payload) {
        state.user = payload
    }
}
export const actions = {
}