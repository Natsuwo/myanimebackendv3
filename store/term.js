import { deleteTerm, addNew, update } from "../services/Term";

const ADD = 'add'
const UPDATE = 'update'
const TERMS = 'terms'
const TERM = 'term'
const DELETE = 'delete'

export const state = () => {
    return {
        terms: [],
        term: {},
    }
}

export const actions = {
    async termsData({ commit }, res) {
        return commit(TERMS, { res })
    },
    async addNew({ commit }, data) {
        var response = await addNew(data.headers, data.formData)
        if (response.data.success) {
            commit(ADD, { res: response.data })
        }
        return response.data
    },
    async update({ commit }, data) {
        var { headers, formData, item } = data
        var response = await update(headers, formData)
        if (response.data.success) {
            commit(UPDATE, { item, res: response.data })
        }
        return response.data
    },
    async deleteTerm({ commit }, data) {
        var { headers, form, item } = data
        var response = await deleteTerm(headers, form)
        if (response.data.success) {
            commit(DELETE, { item, data: response.data })
        }
        return response.data
    }
}

export const mutations = {
    [TERMS](state, { res }) {
        state.terms = res
    },
    [ADD](state, { res }) {
        state.terms.push(res.data)
    },
    [UPDATE](state, { item, res }) {
        const index = state.terms.indexOf(item);
        if (index >= 0) return state.terms[index] = res.data
    },
    [DELETE](state, { item, data }) {
        if (data.success) {
            const index = state.terms.indexOf(item);
            if (index >= 0) return state.terms.splice(index, 1);
        }
    }
}