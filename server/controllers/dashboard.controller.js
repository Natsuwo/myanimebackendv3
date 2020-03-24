const User = require('../models/User')
const Lang = require('../models/Lang')
const Anime = require('../models/Anime')
const Episode = require('../models/Episode')
const Comment = require('../models/Comment')

module.exports = {
    async dashBoard(req, res) {
        try {
            var animes = await Anime.countDocuments()
            var episodes = await Episode.countDocuments()
            var comments = await Comment.countDocuments()
            var users = await User.countDocuments()
            res.send({ success: true, data: { animes, episodes, comments, users } })
        } catch (err) {
            res.send({ success: false, error: err.message })
        }
    },
    async getAnime(req, res) {
        try {
            var animes = await Anime.find({}, { _id: 0 }).select('anime_id title thumbPortrait')
            res.send({ success: true, data: animes })
        } catch (err) {
            res.send({ success: false, error: err.message })
        }
    },
    async getLang(req, res) {
        try {
            var lang = await Lang.find({}, { _id: 0, __v: 0 })
            res.send({ success: true, data: lang })
        } catch (err) {
            res.send({ success: false, error: err.message })
        }
    }
}