const mongoose = require('mongoose')

const BrandSchema = new mongoose.Schema({

    categoryId: {
        type: mongoose.Types.ObjectId,
        ref: 'Category',
        required: [true, "Product Category is required"]
    },

    brand: {
        type: String,
        required: [true, "Brand is required"],
        unique: true
    }
})

module.exports = mongoose.model('Brand', BrandSchema)