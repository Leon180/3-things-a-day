const models = require('../../models')

const types = ['sport', 'book', 'relax']
const timeReg = /(2[0-3]|1\d|0\d):([1-5]\d|0\d):00/

const cardController = {
    get: async (req, res) => {
        try {
            const cardId = req.params.id
            const card = await models.Card.findByPk(cardId, {
                include: [
                    {
                        model: models.Date,
                        attributes: ['id', 'year', 'month', 'day'],
                    },
                    {
                        model: models.User,
                        attributes: ['id', 'name', 'email']
                    }
                ],
                raw: true,
                nest: true
            })
            if (!card) return res.status(400).json({
                message: "incorrect card id, card doesn't exist"
            })
            return res.status(200).json({
                message: "card found",
                data: card
            })
        } catch (error) {
            res.status(500).json({
                error: error.message
            })
        }
    },
    post: async (req, res) => {
        try {
            const { title, type, start, end, record } = req.body
            if (record.length > 200) return res.status(400).json({
                message: "record length limit is 200 characters"
            })
            const create = await models.Card.create({ ...req.body })
            if (!create) return res.status(500).json({
                error: "create failed"
            })
            return res.json({
                status: "success",
                message: "Create successfully!",
                data: create
            })
        } catch (error) {
            res.status(500).json({
                status: "failure",
                message: error.message
            })
        }
    },
    put: async (req, res) => {
        try {
            const { title, type, start, end, record } = req.body
            if (!req.params.id) return res.status(400).json({
                message: "incorrect data format: id is required"
            })
            const cardId = req.params.id
            if (!title || !type || !start || !end) return res.status(400).json({
                message: "incorrect data format: title, type, start, end are required"
            })
            if (title.length > 20) return res.status(400).json({
                message: "title length limit is 20 characters"
            })
            if (!types.includes(type)) return res.status(400).json({
                message: "type must be work, study or life"
            })
            if (!timeReg.test(start) || !timeReg.test(end)) return res.status(400).json({
                message: "incorrect data format: start and end must be in HH:mm:ss format"
            })
            if (start >= end) return res.status(400).json({
                message: "incorrect data format: start must be earlier than end"
            })
            if (record !== null && record.length > 140) return res.status(400).json({
                message: "reocrd length limit is 140 characters"
            })
            const card = await models.Card.findByPk(cardId)
            if (!card) return res.status(400).json({
                message: "incorrect card id, card doesn't exist"
            })
            if (card.createdAt.getDate() !== new Date().getDate()) return res.status(400).json({
                message: "card can only be updated on the same day"
            })
            const cardUpdate = await card.update({
                ...req.body
            })
            if (!cardUpdate) res.status(500).json({
                message: "update failed"
            })
            return res.status(201).json({
                message: "update successfully",
                data: cardUpdate
            })
        } catch (error) {
            res.status(500).json({
                message: error.message
            })
        }
    }
}

module.exports = cardController
