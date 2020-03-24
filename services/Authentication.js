import Api from './Api'

export function signUp(headers, form) {
    return Api(headers).post('/auth/sign-up', form);
}

export function profile(headers) {
    return Api(headers).get('/setting/profile');
}

export function updateProfile(headers, form) {
    return Api(headers).put('/setting/profile', form);
}

export function signIn(headers, form) {
    return Api(headers).post('/auth/sign-in', form)
}

export function checkUserToken(headers) {
    return Api(headers).post('/auth/check-user-token')
}