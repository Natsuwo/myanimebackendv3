const axios = require('axios')
const Anime = require('../models/Anime')
const Episode = require('../models/Episode')
const { changeToSlug } = require('../helpers')

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
}

module.exports = {
    async get(req, res) {
        try {
            var count = await Anime.countDocuments()
            var page = parseInt(req.query.page || 1)
            var perPage = parseInt(req.query.limit || 10)
            var query = Anime.find({}, { __v: 0, _id: 0 }).sort({ created_at: -1 })
            var animes = await query.skip((page - 1) * perPage).limit(perPage)
            var totalPage = Math.ceil(count / perPage);
            var search = req.query.q

            if (search) {
                if (/["]/.test(search)) {
                    var regex = search.replace(/['"]+/g, '')
                } else {
                    var regex = new RegExp(escapeRegex(search), 'gi')
                }
                count = await Anime.countDocuments({ $or: [{ title: regex }, { status: regex }, { season: regex }] })
                query = Anime.find({ $or: [{ title: regex }, { status: regex }, { season: regex }] }, { __v: 0, _id: 0 }).sort({ created_at: -1 })
                totalPage = Math.ceil(count / perPage);
                animes = await query.skip((page - 1) * perPage).limit(perPage)
            }
            res.send({ success: true, data: { animes, options: { page, perPage, totalPage } }, count })

        } catch (err) {
            res.send({ success: false, error: err.message })
        }
    },
    async post(req, res) {
        try {
            var { data } = req.body
            var { title, en_title, jp_title, type, premiered, genres, season, studios, description, thumb, thumbPortrait } = JSON.parse(data)
            var slug = changeToSlug(title)
            if (!slug) throw Error("Can't create slug, please contact admin to fix it.")
            var animeCreate = await Anime.create({ title, slug, en_title, jp_title, type, premiered, genres, season, studios, description, thumb, thumbPortrait })
            var anime_id = animeCreate.anime_id
            res.send({ success: true, anime_id, message: 'Added.' })
        } catch (err) {
            res.send({ success: false, error: err.message })
        }
    },
    async getUpdate(req, res) {
        try {
            var { anime_id } = req.query
            if (anime_id) {
                var anime = await Anime.findOne({ anime_id }, { _id: 0, __v: 0 })
                return res.send({ success: true, data: { anime } })
            }
        } catch (err) {
            res.send({ success: false, error: err.message })
        }
    },
    async postUpdate(req, res) {
        try {
            var { data } = req.body
            var { anime_id, title, en_title, jp_title, type, premiered, genres, season, studios, description, thumb, thumbPortrait } = JSON.parse(data)
            await Anime.updateOne({ anime_id }, { title, en_title, jp_title, type, premiered, genres, season, studios, description, thumb, thumbPortrait })
            return res.send({ success: true, message: 'Edited.' })
        } catch (err) {
            return res.send({ succes: false, error: err.message })
        }
    },
    async removeTerm(req, res) {
        try {
            var { anime_id, meta_id } = req.body
            await AnimeR.deleteOne({ anime_id, meta_id })
            return res.send({ success: true, message: 'Removed.' })

        } catch (err) {
            res.send({ success: false, error: err.message })
        }
    },
    async removeAnime(req, res) {
        try {
            var { anime_id } = req.body
            await Anime.deleteOne({ anime_id })
            await Episode.deleteMany({ anime_id })
            return res.send({ success: true, message: 'Removed.' })
        } catch (err) {
            res.send({ success: false, error: err.message })
        }
    },
    async crawlAnime(req, res) {
        try {
            var { id } = req.body
            var response = await axios.get(`https://api.jikan.moe/v3/anime/${id}`)
            res.send({ success: true, results: response.data })
        } catch (err) {
            res.send({ success: false, error: err.message })
        }
    }
}