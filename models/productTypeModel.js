const mongoose = require('mongoose')

const ProductTypeSchema = new mongoose.Schema({
    
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'Category',
        required: [true, "Product Category is required"] 
    },


    productType: {
        type: String,
        required: [true, "ProductType is required"],
    }
})

ProductTypeSchema.index({ category: 1, productType: 1 }, { unique: true })

module.exports = mongoose.model('ProductType', ProductTypeSchema)