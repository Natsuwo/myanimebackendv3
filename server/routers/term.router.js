const { Router } = require('express')
const route = Router()
const { get, post, update, deleteTerm } = require('../controllers/term.controller')
const { checkExist } = require('../middlewares/term.middleware')
const { checkSecure, isUserLogin } = require('../validate/secure.validate')

route.get('/term/get', checkSecure, isUserLogin, get)
route.post('/term/post', checkSecure, isUserLogin, checkExist, post)
route.put('/term/update', checkSecure, isUserLogin, update)
route.delete('/term/delete', checkSecure, isUserLogin, deleteTerm)

module.exports = route