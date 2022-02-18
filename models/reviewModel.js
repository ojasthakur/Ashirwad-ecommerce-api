const { mongo } = require("mongoose")

const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true,'Rating is required']
    },
    title: {
        type: String,
        trim:true,  
        required: [true, 'Title is required'],
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    comment: {
        type: String,
        maxlength: [500, 'Comment cannot be more than 500 characters'],
        required: [true, 'Comments are required']
    },
   user: {
       type: mongoose.Types.ObjectId,
       ref: 'User',
       required: true
    },
    product: {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        required: true
   }
}, { timestamps: true })

//....Each user can only leave one review per product
//....This can be achieved using two ways:
//....1....indexing on the schema
//....2....in the controller

//....1.... you can't set unique on user and product separately
//.... you need to set compound index
ReviewSchema.index({ product: 1, user: 1 }, { unique: true })

//....methods are invoked on instances of models, example one user/review/product
//....static methods are called on the schema
ReviewSchema.statics.calculateAverageRating = async function (productId) {
    const result = await this.aggregate([
        {
            $match:{product: productId} //first stage
        },
        {
            $group: {
                _id: null,
                averageRating: { $avg: '$rating' },
                numberOfReviews:{$sum: 1}
            }
        }
    ])
    console.log(result)
    try {
        await this.model('Product').findOneAndUpdate({ _id: productId }, {
            averageRating: Math.ceil(result[0]?.averageRating || 0),
            numberOfReviews: result[0] ?.numberOfReviews || 0

        })
    } catch (error) {
        console.log(error)
    }
}

ReviewSchema.post('save', async function () {
    //now calling the static method the schema has//
    await this.constructor.calculateAverageRating(this.product)
    console.log('...postSaveHook...')
})
ReviewSchema.post('remove', async function () {
    await this.constructor.calculateAverageRating(this.product)
    console.log('...postRemoveHook....')
})
module.exports = mongoose.model('Review',ReviewSchema)