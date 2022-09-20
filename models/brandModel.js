const mongoose = require('mongoose')

const BrandSchema = new mongoose.Schema({
    brand: {
        type: String,
        required: [true, "Brand is required"],
        unique: true
    }
})

module.exports = mongoose.model('Brand', BrandSchema)