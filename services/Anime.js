import Api from './Api'

export function get(headers, limit, page, search) {
    var limitQuery = limit ? `?limit=${limit}` : '?limit=10'
    var pageQuery = page ? `&page=${page}` : ''
    var searchQuery = search ? `&q=${search}` : ''
    return Api(headers).get(`/anime/get${limitQuery}${pageQuery}${searchQuery}`)
}

export function addNew(headers, form) {
    return Api(headers).post('/anime/post', form)
}

export function getUpdate(headers, id) {
    return Api(headers).get(`/anime/update?anime_id=${id}`)
}

export function postUpdate(headers, form) {
    return Api(headers).put('/anime/update', form)
}

export function removeTerm(headers, form) {
    return Api(headers).post('/anime/remove-term', form)
}

export function removeAnime(headers, form) {
    return Api(headers).post('/anime/remove-anime', form)
}

export function crawlAnime(headers, form) {
    return Api(headers).post('/anime/crawl', form)
}