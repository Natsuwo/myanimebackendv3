import Api from './Api'

export function getAll(headers) {
    return Api(headers).get(`/term/get`)
}

export function addNew(headers, form) {
    return Api(headers).post('/term/post', form)
}

export function update(headers, form) {
    return Api(headers).put('/term/update', form)
}

export function deleteTerm(headers, form) {
    return Api(headers).delete('/term/delete', { data: form })
}