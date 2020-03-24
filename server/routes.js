const {Router} = require('express')
const router = Router()
// Hosts
const auth = require('./routers/auth.router')
const comment = require('./routers/comment.router')
const anime = require('./routers/anime.router')
const episode = require('./routers/episode.router')
const term = require('./routers/term.router')
const dashboard = require('./routers/dashboard.router')
const option = require('./routers/option.router')
// Router Use
router.use(auth)
router.use(comment)
router.use(anime)
router.use(episode)
router.use(term)
router.use(dashboard)
router.use(option)

module.exports = router