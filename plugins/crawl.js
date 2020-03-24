import axios from "axios"

export function getId(url) {
    var regExp = /\/anime\/(\d+)/;
    var match = url.match(regExp);
    if (!match) {
        return false;
    }
    return match[1];
}

export function getList(id) {
    var api = `https://api.jikan.moe/v3/anime/${id}`
    var result = axios.get(api)
    return result
}
