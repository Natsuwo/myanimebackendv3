const Term = require('../models/Genre')

module.exports = {
    async checkExist(req, res, next) {
        try {
            var { title } = req.body
            if (!title) throw Error('Missing name.')
            var termFound = await Term.findOne({ title })
            if (!termFound) {
                return next()
            }
            return res.send({ success: false, error: `Genre ${title} already exist.` })
        } catch (err) {
            res.send({ success: false, error: err.message })
        }
    }
}