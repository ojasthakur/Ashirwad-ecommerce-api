const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema({
    section: {
        type: String,
        required: [true, 'Section is required']
    },

    category: {
        type: String,
        required: [true, "Category is required"],
        unique: true
    }
})

module.exports = mongoose.model('Category', CategorySchema)