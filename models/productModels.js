const { boolean } = require('joi')
const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxlength: [150,'Name cannot be more than 150 characters']
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        default: true
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        maxlength:[1000, 'Description cannot be more than 1000 characters']
    },
    // image: {
    //     type: String,
    //     default: '/productImages/example.jpg'
    //     //required: true
    // },
    image: [{type: String}],
    category: {
        type: String,
        required: [true, 'Product category is required'],
        enum: ['office','kitchen','bedroom']
    },
    company: {
        type: String,
        required: [true, 'Product Company is required'],
        enum: {
            values: ['ikea', 'liddy', 'marcos'],
            message: '{VALUE} is not supported'
        }
    },
    colors: {
        type: [String],
        required: [true],
        default: ['#222']
    },
    featured: {
        type: Boolean,
        default: false
    },
    freeShipping: {
        type: Boolean,
        required: false
    },
    inventory: {
        type: Number,
        required: true,
        default: 15
    },
    averageRating: {
        type: Number,
        default: 0
    },
    numberOfReviews: {
        type: Number,
        default: 0 
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, { timestamps: true, toJSON:{virtuals:true}, toObject:{virtuals:true} })
//....toJson and toObject are added to accept virtuals
//....now we have to add the virtual property
ProductSchema.virtual('reviews', { //....'reviews' is the ref we used in the populate method in the controller
    ref: 'Review', //.... the model/collection we are making the connection to
    localField: '_id', //.... the field in product which links to reviews
    foreignField: 'product', //.... the field in reviews which links to product
    justOne: false, //....this is to get a list not one review
    //match: {rating: 5} //....to get a review matching the given criteria
})

ProductSchema.pre('remove', async function () {
    await this.model('Review').deleteMany({product : this._id})
})

module.exports = mongoose.model('Product', ProductSchema)