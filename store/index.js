export const strict = false
export const state = () => ({
    user: false,
    setting: null,
})
export const mutations = {
    setUser(state, payload) {
        state.user = payload
    }
}
export const actions = {
    actionSetUser({commit},user){
        console.log("actionSetUser")
    }
}