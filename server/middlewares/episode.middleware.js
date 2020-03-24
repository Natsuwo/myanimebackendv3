function get_id(url) {
    var regExp = /(?:https?:\/\/)?(?:[\w\-]+\.)*(?:drive|docs)\.google\.com\/(?:(?:open|uc)\?(?:[\w\-\%]+=[\w\-\%]*&)*id=|(?:folder|file)\/d\/|\/ccc\?(?:[\w\-\%]+=[\w\-\%]*&)*key=)([\w\-]{28,})/i;
    var match = url.match(regExp);
    if (!match) {
        return false;
    }
    return match[1];
}
module.exports = {
    async validateDrive(req, res, next) {
        try {
            var { source } = req.body
            if (!source) return res.send({ success: false, error: 'Source field must required!!' })
            var source = get_id(source)
            if (!source) return res.send({ success: false, error: 'Source field must a link of google drive!!' })
            res.locals.source = source
            next()
        } catch (err) {
            res.send({ success: false, error: err.message })
        }
    },
    async beforeAddMulti(req, res, next) {
        try {
            var { anime_id, type, audio, subtitle } = req.body.form
            if (!anime_id || !type || !audio || !subtitle) throw Error('Missing field(s), please check again.')
            next()
        } catch (err) {
            res.send({ success: false, error: err.message })
        }
    }
}