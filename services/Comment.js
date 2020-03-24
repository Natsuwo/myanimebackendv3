import Api from './Api'

export function getComments(headers) {
    return Api(headers).get('/comment/get')
}

export function removeComment(headers, form) {
    return Api(headers).delete('/comment/remove', { data: form })
}