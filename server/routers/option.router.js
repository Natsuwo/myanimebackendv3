const { Router } = require('express')
const route = Router()
const { getOption, updateOption, updateProfile, createOption, getCalendar, 
    createCalendar, updateCalendar, removeCalendar } = require('../controllers/option.controller')
const { changePassword, changePin } = require('../middlewares/option.middleware')
const { checkSecure, isUserLogin } = require('../validate/secure.validate')
const { uploadImage, tryLogin } = require('../middlewares/upimg.middleware')

route.put('/option/profile', checkSecure, isUserLogin, uploadImage, changePassword, changePin, updateProfile)
route.get('/option/get', checkSecure, isUserLogin, getOption)
route.post('/option/create', checkSecure, isUserLogin, createOption)
route.put('/option/update', checkSecure, isUserLogin, updateOption)
route.get('/option/calendar', checkSecure, isUserLogin, getCalendar)
route.post('/option/calendar', checkSecure, isUserLogin, createCalendar)
route.put('/option/calendar', checkSecure, isUserLogin, updateCalendar)
route.delete('/option/calendar', checkSecure, isUserLogin, removeCalendar)
route.delete('/bot/discord-relogin', tryLogin)

module.exports = route