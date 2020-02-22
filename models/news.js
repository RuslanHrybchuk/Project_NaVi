const mongoose = require('mongoose')

const newsSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('News', newsSchema)