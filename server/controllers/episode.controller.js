const Anime = require('../models/Anime')
const Episode = require('../models/Episode')
const Comment = require('../models/Comment')
const { getDriveId, urlValid, dupSource } = require('../helpers')
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
}

async function setNew(anime_id) {
    await Anime.updateOne({ anime_id }, { new: true, updated_at: Date.now() })
    var count = await Anime.countDocuments({ new: true })
    if (count > 30) {
        await Anime.updateOne({ new: true }, { new: false })
    }
}

async function addtoDrstream(drive_id) {
    var drdomain = process.env.DRDOMAIN
    var endpoint = drdomain + "/api/v2/hls-drive/add-new"
    var user_id = process.env.DRUSER
    var secret_token = process.env.DRTOKEN
    await axios.post(endpoint + `?user_id=${user_id}&secret_token=${secret_token}&drive_id=${drive_id}&setPremium=true`)
}

module.exports = {
    async get(req, res) {
        try {
            var count = await Episode.countDocuments({})
            var page = parseInt(req.query.page || 1)
            var perPage = parseInt(req.query.limit || 20)
            var query = Episode.find({}, { __v: 0, _id: 0 }).sort({ created_at: -1 })
            var episodes = await query.skip((page - 1) * perPage).limit(perPage)
            var totalPage = Math.ceil(count / perPage);
            var search = req.query.q

            if (search) {
                if (/["]/.test(search)) {
                    var regex = search.replace(/['"]+/g, '')
                } else {
                    var regex = new RegExp(escapeRegex(search), 'gi')
                }

                var query = Anime.find({ $or: [{ title: regex }, { status: regex }, { season: regex }] }, { _id: 0 }).sort({ updated_at: -1 })
                var animes = await query.select('title anime_id')

                var episodes = []
                var count = 0
                for (var item of animes) {
                    var epCount = await Episode.countDocuments({ anime_id: item.anime_id })
                    count += epCount
                    var items = await Episode.find({ anime_id: item.anime_id }, { __v: 0, _id: 0 })
                        .sort({ created_at: -1 })
                    for (var episode of items) {
                        episodes.push(episode)
                    }

                }
                var totalPage = Math.ceil(count / perPage);
                episodes = episodes.slice((page - 1) * perPage, page * perPage)
                return res.send({ success: true, count, data: episodes, animes, meta: { page, perPage, totalPage } })
            }

            var animes = []
            for (let episode of episodes) {
                var anime_id = episode.anime_id
                var anime = await Anime.findOne({ anime_id }, { _id: 0 }).select('title anime_id')
                if (anime) animes.push(anime)
            }
            res.send({ success: true, count, data: episodes, animes, meta: { page, perPage, totalPage } })
        } catch (err) {
            res.send({ success: false, error: err.message })
        }
    },
    async post(req, res) {
        try {
            var { anime_id, caption, number, description, thumbnail, sources, isNew } = req.body
            if (!anime_id) throw Error('Missing Anime')
            var isHas = await Episode.findOne({ anime_id, number })
            if (isHas) throw Error("This episode already exist!")
            if (sources.length > 0) {
                for (item of sources) {
                    var isUrl = urlValid(item.source)
                    if (!isUrl) {
                        await addtoDrstream(item.source)
                        continue;
                    } else {
                        var drive_id = getDriveId(item.source)
                        if (drive_id) {
                            await addtoDrstream(item.source)
                            item.source = drive_id
                        } else {
                            throw Error("Drive id not valid.")
                        }
                    }
                }
            }
            var episodeCreate = await Episode.create({ anime_id, caption, number, thumbnail, description, sources })
            var episode_id = episodeCreate.episode_id
            if (isNew) {
                await setNew(anime_id)
            }
            return res.send({ success: true, episode_id, message: "Added." })
        } catch (err) {
            res.send({ success: false, error: err.message })
        }
    },
    async getUpdate(req, res) {
        try {
            var { episode_id } = req.query
            if (episode_id) {
                var episode = await Episode.findOne({ episode_id }, { __v: 0, _id: 0 })
                return res.send({ success: true, result: { episode } })
            }
        } catch (err) {
            res.send({ success: false, error: err.message })
        }
    },
    async update(req, res) {
        try {
            var { episode_id, anime_id, caption, number, description, sources, thumbnail, isNew } = req.body
            if (sources.length > 0) {
                for (item of sources) {
                    var isUrl = urlValid(item.source)
                    if (!isUrl) {
                        await addtoDrstream(item.source)
                        continue;
                    } else {
                        var drive_id = getDriveId(item.source)
                        if (drive_id) {
                            await addtoDrstream(item.source)
                            item.source = drive_id
                        } else {
                            throw Error("Drive id not valid.")
                        }
                    }
                }
            }
            await Episode.updateOne({ episode_id }, { anime_id, caption, number, thumbnail, description, sources })
            if (isNew) {
                await setNew(anime_id)
            }
            return res.send({ success: true, message: 'Edited.' })
        } catch (err) {
            res.send({ success: false, error: err.message })
        }
    },
    async removeEpisode(req, res) {
        try {
            var { episode_id } = req.body
            await Episode.deleteOne({ episode_id })
            await Comment.deleteMany({ episode_id })
            return res.send({ success: true, message: 'Removed.' })
        } catch (err) {
            res.send({ success: false, error: err.message })
        }
    },
    async addMulti(req, res) {
        try {
            var { form, lists, isNew } = req.body
            var { anime_id, type, audio, subtitle, description, suffix } = form
            for (var item of lists) {
                var source = item.id
                var caption = item.title
                var number = item.number
                var thumbnail = item.thumbnail
                var isHasEp = await Episode.findOne({ anime_id, number })
                if (isHasEp) {
                    var { episode_id } = isHasEp
                    var old_sources = isHasEp.sources
                    var dup = false
                    for (var value of old_sources) {
                        dup = dupSource(value, type, audio, subtitle, suffix)
                    }
                    if (!dup) {
                        await addtoDrstream(source)
                        var sources = { source, type, audio, subtitle, suffix }
                        await Episode.updateOne({ episode_id }, { $push: { sources } })
                    }
                } else {
                    var sources = []
                    await addtoDrstream(source)
                    sources.push({ source, type, audio, subtitle, suffix })
                    await Episode.create({ anime_id, caption, number, thumbnail, description, sources })
                }
            }
            if (isNew) {
                await setNew(anime_id)
            }
            res.send({ success: true, message: "You added." })
        } catch (err) {
            res.send({ success: false, error: err.message })
        }
    },
    async getEditMulti(req, res) {
        try {
            var { anime_id, numbers } = req.query
            var to_from = numbers.replace(/\s/g, '').split(/[-,\n|]/)
            var to = to_from[0]
            var from = to_from[1]
            var episodes = await Episode.find({ anime_id, number: { $gte: to, $lte: from } })
            if (episodes.length === 0) throw Error('Not found')
            res.send({ success: true, results: episodes, message: "Found." })
        } catch (err) {
            res.send({ success: false, error: err.message })
        }
    },
    async editMulti(req, res) {
        try {
            var { lists, isNew } = req.body
            for (var item of lists) {
                var { episode_id, caption, number, thumbnail, description, sources } = item
                if (sources.length > 0) {
                    for (source of sources) {
                        var isUrl = urlValid(item.source)
                        if (!isUrl) {
                            await addtoDrstream(item.source)
                            continue;
                        } else {
                            var drive_id = getDriveId(item.source)
                            if (drive_id) {
                                await addtoDrstream(item.source)
                                item.source = drive_id
                            } else {
                                throw Error("Drive id not valid.")
                            }
                        }
                    }
                }
                await Episode.updateOne({ episode_id }, { caption, number, thumbnail, description, sources })
            }
            if (isNew) {
                await setNew(anime_id)
            }
            res.send({ success: true, message: "You edited." })
        } catch (err) {
            res.send({ success: false, error: err.message })
        }
    }
}