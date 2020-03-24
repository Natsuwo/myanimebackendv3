import Api from './Api'

export function dashboard(headers) {
    return Api(headers).get('/dashboard/index')
}


export function getAnime(headers) {
    return Api(headers).get('/dashboard/get-anime')
}

export function getLang(headers) {
    return Api(headers).get('/dashboard/get-lang')
}
