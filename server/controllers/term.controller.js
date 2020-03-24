const Term = require('../models/Genre')
module.exports = {
    async get(req, res) {
        try {
            var terms = await Term.find({}, { _id: 0, __v: 0 })
            return res.send({ success: true, data: terms })
        } catch (err) {
            res.send({ success: false, error: err.message })
        }
    },
    async post(req, res) {
        try {
            req.connection.setTimeout(60 * 10 * 1000)
            var { title, description } = req.body
            var termCreate = await Term.create({ title, description })
            return res.send({ success: true, message: 'Added', data: termCreate })
        } catch (err) {
            res.send({ success: false, error: err.message })
        }
    },
    async update(req, res) {
        try {
            var { genre_id, title, description } = req.body
            await Term.updateOne({ genre_id }, { title, description })
            return res.send({ success: true, message: 'Edited.' })
        } catch (err) {
            res.send({ success: false, error: err.message })
        }
    },
    async deleteTerm(req, res) {
        try {
            var { genre_id } = req.body
            await Term.deleteOne({ genre_id })
            res.send({ success: true, message: 'Deleted.' })
        } catch (err) {
            res.send({ success: false, error: err.message })
        }
    }
}