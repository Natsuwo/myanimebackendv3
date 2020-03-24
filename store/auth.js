const PROFILE = 'profile'
export const state = () => {
    return {
        isLogin: false,
        userToken: "",
        user_id: null,
        profile: []
    }
}

export const actions = {
    async profileData({ commit }, data) {
        return commit(PROFILE, { data })
    }
}

export const mutations = {
    [PROFILE](state, { data }) {
        state.profile = data
    }
}