import Api from './Api'

export function addNew(headers, form) {
    return Api(headers).post('/episode/post', form)
}

export function get(headers, limit, page, search) {
    var limitQuery = limit ? `?limit=${limit}` : '?limit=20'
    var pageQuery = page ? `&page=${page}` : ''
    var searchQuery = search ? `&q=${search}` : ''
    return Api(headers).get(`/episode/get${limitQuery}${pageQuery}${searchQuery}`)
}

export function getUpdate(headers, id) {
    return Api(headers).get(`/episode/update?episode_id=${id}`)
}

export function update(headers, form) {
    return Api(headers).put('/episode/update', form)
}

export function removeEpisode(headers, form) {
    return Api(headers).delete('/episode/remove-episode', { data: form })
}

export function addMulti(headers, form) {
    return Api(headers).post('/episode/add-multi', form)
}

export function getEditMulti(headers, id, numbers) {
    var animeQuery = id ? `?anime_id=${id}` : ''
    var numbersQuery = numbers ? `&numbers=${numbers}` : ''
    return Api(headers).get(`/episode/edit-multi${animeQuery}${numbersQuery}`)
}

export function editMulti(headers, form) {
    return Api(headers).put('/episode/edit-multi', form)
}