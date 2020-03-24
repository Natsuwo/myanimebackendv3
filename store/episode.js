const EPISODES = 'episodes'
const EPISODE = 'episode'
const DELETE = 'delete'

export const state = () => {
    return {
        animes: [],
        episodes: [],
        episode: {},
        meta: [],
        count: 0
    }
}

export const actions = {
    async episodesData({ commit }, res) {
        return commit(EPISODES, { res })
    },
    async episodeData({ commit }, data) {
        return commit(EPISODE, { data })
    },
    async removeEpisode({ commit }, data) {
        return commit(DELETE, { data })
    }
}

export const mutations = {
    [EPISODES](state, { res }) {
        state.episodes = res.data
        state.count = res.count
        state.meta = res.meta
        state.animes = res.animes
    },
    [EPISODE](state, { data }) {
        state.episode = data
    },
    [DELETE](state, { data }) {
        const index = state.episodes.indexOf(data);
        if (index >= 0) state.episodes.splice(index, 1);

    }


}