import axios from "axios"

export function isValid(url) {
    var regExp = /(?:https?:\/\/)?(?:[\w\-]+\.)*(?:drive|docs)\.google\.com\/(?:(?:open|uc)\?(?:[\w\-\%]+=[\w\-\%]*&)*id=|(?:folder|file)\/d\/|\/ccc\?(?:[\w\-\%]+=[\w\-\%]*&)*key=)([\w\-]{28,})/i;
    var match = url.match(regExp);
    if (!match) {
        return false;
    }
    return true;
}

export function getDriveId(url) {
    var regExp = /(?:https?:\/\/)?(?:[\w\-]+\.)*(?:drive|docs)\.google\.com\/(?:(?:open|uc)\?(?:[\w\-\%]+=[\w\-\%]*&)*id=|(?:folder|file)\/d\/|\/ccc\?(?:[\w\-\%]+=[\w\-\%]*&)*key=)([\w\-]{28,})/i;
    var match = url.match(regExp);
    if (!match) {
        return false;
    }
    return match[1];
}


export function getList(id) {
    var fields = 'items(title,id)'
    var key = 'AIzaSyDtV2YN9J2TYCIvO688nsToWj7LtJvqLyo'
    var folder = `https://www.googleapis.com/drive/v2/files?q=%27${id}%27%20in%20parents&maxResults=9999&orderBy=title_natural&key=${key}&fields=${fields}`
    var result = axios.get(folder)
    return result
}

export function getNumber(str) {
    var num = str.replace(/[^0-9]/g, '');
    return parseInt(num, 10);
}