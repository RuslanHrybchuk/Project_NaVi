const mongoose = require('mongoose')

const fanSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: false
    },
    message: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Fan', fanSchema)