const Review = require('../models/reviewModel')
const Product = require('../models/productModels')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const { checkPermissions } = require('../utils')


const createReview = async (req, res) => {
    const { product: productId } = req.body
    
    req.body.user = req.user.userId
    
    //....We need to check if the product id in the req.body is valid or not
    const isValidProduct = await Product.findOne({ _id: productId });
    if (!isValidProduct) {
        throw new CustomError.NotFoundError(`No product with id: ${productId}`)
    }

    //....Checking if customer already left a review: Redundant cause we set
    //....compound indexing in database
    // const alreadySubmitted = await Review.findOne({
        // product: productId,
        // user: req.user.userId
    // })
    // if (alreadySubmitted) {
        // throw new CustomError.BadRequestError(
            // 'Already Submitted review for this product'
        // )
    // }

    const review = await Review.create(req.body)

    res.status(StatusCodes.CREATED).json({review: review})
}

const getAllReviews = async (req, res) => {
    const {product: productId} = req.body
    if (!productId) {
        const reviews = await Review.find({})
            .populate({ path: 'product', select: 'name company ' })
        .populate({path:'user',select:'email'})
        return res.status(StatusCodes.OK).json({
            count: reviews.length,
            msg: `Reviews for all products`,
            reviews
        })

    }
    const reviews = await Review.find({
        product: productId
    })//.populate({path: 'product',select: 'name company price'})

    res.status(StatusCodes.OK).json({
        count: reviews.length,
        msg: `Reviews for product: ${productId}`,
        reviews
    })
}

const getSingleReview = async (req, res) => {
    const { id: reviewId } = req.params
    const review = await Review.findOne({ _id: reviewId })
    if (!review) {
        throw new CustomError.NotFoundError(`No review with id: ${reviewId}`)
    }
    res.status(StatusCodes.OK).json({review})
}

const updateReview = async (req, res) => {
    const { id: reviewId } = req.params
    const { rating, title, comment } = req.body

    const review = await Review.findOne({_id: reviewId})
    if (!review) {
        throw new CustomError.NotFoundError('Review does not exist')
    }
    checkPermissions(req.user, review.user)
    review.rating = rating
    review.title = title
    review.comment = comment
    
    
    await review.save()
    res.status(StatusCodes.OK).json({
        msg: 'Success, review updated',
        review
    }) 

}

const deleteReview = async (req, res) => {
    const { id: reviewId } = req.params
    const review = await Review.findOne({ _id: reviewId })
    if (!review) {
        throw new CustomError.NotFoundError('Review does not exist')
    }
    checkPermissions(req.user, review.user)
    await review.remove()
    res.status(StatusCodes.OK).json({msg:'Success, review removed'})
}

module.exports = {
    createReview,
    getAllReviews,
    getSingleReview,
    updateReview,
    deleteReview
}