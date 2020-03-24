const { Router } = require('express')
const route = Router()
const { dashBoard, getAnime, getLang } = require('../controllers/dashboard.controller')
const { checkSecure, isUserLogin } = require('../validate/secure.validate')


route.get('/dashboard/get-anime', checkSecure, isUserLogin, getAnime)
route.get('/dashboard/get-lang', checkSecure, isUserLogin, getLang)
route.get('/dashboard/index', checkSecure, isUserLogin, dashBoard)

module.exports = route