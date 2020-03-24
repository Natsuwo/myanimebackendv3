import Api from './Api'

export function getOption(headers, id) {
    if(!id) id = null
    return Api(headers).get('/option/get?id=' + id)
}

export function createOption(headers, form) {
    return Api(headers).post('/option/create', form)
}

export function updateOption(headers, form) {
    return Api(headers).put('/option/update', form)
}

export function getCalendar(headers) {
    return Api(headers).get('/option/calendar')
}

export function createCalendar(headers, form) {
    return Api(headers).post('/option/calendar', form)
}

export function updateCalendar(headers, form) {
    return Api(headers).put('/option/calendar', form)
}

export function removeCalendar(headers, form) {
    return Api(headers).delete('/option/calendar', { data: form })
}