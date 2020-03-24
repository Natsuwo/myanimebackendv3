const fs = require('fs')
const axios = require('axios')
const { Attachment } = require('discord.js')
const { discordLogin } = require('../helpers/discord.helper')
const channel = ['624579939471196180', '624580097101398016', '624580119972806666', '624580151937728513', '624637137718870025']
var client;
// discordLogin().then(res => {
//     client = res
// })

module.exports = {
    async uploadImage(req, res, next) {
        try {
            var images = req.files
            if (!images) return next()
            var files = {}
            var discord = fs.readFileSync('./discord.json')
            var { token } = JSON.parse(discord)
            axios.defaults.headers.common['Authorization'] = 'Bot ' + token
            var randChannel = channel[Math.floor(Math.random() * channel.length)]
            for (var image of images) {
                var buffer = image.buffer
                var name = image.fieldname
                var fileName = image.originalname
                var attach = new Attachment(buffer, fileName)
                var resp = await client.channels.get(randChannel).send(attach)
                var get = await axios.get('https://discordapp.com/api/channels/' + randChannel + '/messages/' + resp.id)
                var link = get.data.attachments[0].url
                files[name] = link
            }
            res.locals.files = files
            next()
        } catch (err) {
            res.send({ success: false, error: err.message })
        }
    },
    async getThumbnail(req, res, next) {
        try {
            var { source } = res.locals
            var discord = fs.readFileSync('./discord.json')
            var { token } = JSON.parse(discord)
            axios.defaults.headers.common['Authorization'] = 'Bot ' + token
            var randChannel = channel[Math.floor(Math.random() * channel.length)]
            var thumbnail = `https://drive.google.com/thumbnail?authuser=0&sz=w348-h196-n-k&id=${source}`
            var attach = new Attachment(thumbnail, source + '.jpg')
            var resp = await client.channels.get(randChannel).send(attach)
            var get = await axios
                .get('https://discordapp.com/api/channels/' + randChannel + '/messages/' + resp.id)
                .catch(err => {
                    thumbnail = 'https://cdn.discordapp.com/attachments/624559812054876181/624560031475433482/Fix_Error_Code_6602-720x340.jpeg'
                    res.locals.thumbnail = thumbnail
                    return next()
                })
            thumbnail = get.data.attachments[0].url
            res.locals.thumbnail = thumbnail
            return next()
        } catch (err) {
            return next()
        }
    },
    async getThumbnails(req, res, next) {
        try {
            var { lists } = req.body
            var newLists = []
            var discord = fs.readFileSync('./discord.json')
            var { token } = JSON.parse(discord)
            axios.defaults.headers.common['Authorization'] = 'Bot ' + token
            for (var item of lists) {
                var randChannel = channel[Math.floor(Math.random() * channel.length)]
                var source = item.id
                var thumbnail = `https://drive.google.com/thumbnail?authuser=0&sz=w348-h196-n-k&id=${source}`
                var attach = new Attachment(thumbnail, source + '.jpg')
                var resp = await client.channels.get(randChannel).send(attach)
                var get = await axios
                    .get('https://discordapp.com/api/channels/' + randChannel + '/messages/' + resp.id)
                    .catch(err => {
                        item['thumbnail'] = 'https://cdn.discordapp.com/attachments/624559812054876181/624560031475433482/Fix_Error_Code_6602-720x340.jpeg'
                        newLists.push(item)
                    })
                item['thumbnail'] = get.data.attachments[0].url
                newLists.push(item)
            }
            res.locals.lists = newLists
            next()
        } catch (err) {
            res.locals.lists = lists
            return next()
        }
    },
    async tryLogin(req, res, next) {
        try {
            client = await discordLogin()
            res.send({ success: true, message: "Ok" })
        } catch (err) {
            res.send({ success: false, error: err.message })
        }
    }
}