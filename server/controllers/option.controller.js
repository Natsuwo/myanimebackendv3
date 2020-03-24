const Option = require('../models/Options')
const Calendar = require('../models/Calendar')
const UserAdmin = require('../models/UserAdmin')

module.exports = {
    async updateProfile(req, res) {
        try {
            var { avatar } = req.body
            var { user_id } = res.locals
            var { files } = res.locals
            if (files) {
                if (files['avatar']) {
                    avatar = files['avatar']
                }
            }
            await UserAdmin.updateOne({ user_id }, { avatar })
            res.send({ success: true, message: "You got this." })
        } catch (err) {
            res.send({ success: false, error: err.message })
        }
    },
    async getOption(req, res) {
        try {
            var { id } = req.query
            if (id !== "null" && id) {
                var option = await Option.findOne({ id })
                var options = await Option.find({}, { _id: 0 }).select("id name")
            } else {
                var option = await Option.findOne({ default: true })
                var options = await Option.find({}, { _id: 0 }).select("id name")
            }

            res.send({ success: true, data: { option, options } })
        } catch (err) {
            res.send({ success: false, error: err.message })
        }
    },
    async createOption(req, res) {
        try {
            if (!req.body) throw Error("Emtpy settings.")
            var { name, settings } = req.body
            var isDefault = req.body.default
            if (!isDefault) isDefault = false
            if (isDefault) await Option.updateMany({ default: false })
            await Option.create({ name, settings, default: isDefault })
            res.send({ success: true, message: 'You got this.' })
        } catch (err) {
            res.send({ success: false, error: err.message })
        }
    },
    async updateOption(req, res) {
        try {
            var { id, settings } = req.body
            var isDefault = req.body.default
            if (!isDefault) isDefault = false
            await Option.updateOne({ id }, { settings, default: isDefault })
            res.send({ success: true, message: 'You got this.' })
        } catch (err) {
            res.send({ success: false, error: err.message })
        }
    },
    async getCalendar(req, res) {
        try {
            var calendars = await Calendar.find({}, { _id: 0, __v: 0 })
            res.send({ success: true, data: { calendars } })
        } catch (err) {
            res.send({ success: false, error: err.message })
        }
    },
    async createCalendar(req, res) {
        try {
            if (!req.body) throw Error("Emtpy settings.")
            var { anime, day, date, start_time, end_time } = req.body
            var isHas = await Calendar.findOne({ anime })
            if (isHas) throw Error("This anime already exist, please update or remove.")
            var calendar = await Calendar.create({ anime, day, date, start_time, end_time })
            res.send({ success: true, message: 'You got this.', calendar })
        } catch (err) {
            res.send({ success: false, error: err.message })
        }
    },
    async updateCalendar(req, res) {
        try {
            var { id, day, date, start_time, end_time } = req.body
            await Calendar.updateOne({ id }, { day, date, start_time, end_time })
            res.send({ success: true, message: 'You got this.' })
        } catch (err) {
            res.send({ success: false, error: err.message })
        }
    },
    async removeCalendar(req, res) {
        try {
            var { id } = req.body
            await Calendar.deleteOne({ id })
            res.send({ success: true, message: 'You got this.' })
        } catch (err) {
            res.send({ success: false, error: err.message })
        }
    }
}