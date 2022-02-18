const Product = require('../models/productModels')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const cloudinary = require('cloudinary').v2
const fs = require('fs')
const path = require('path')


const createProduct = async (req, res) => {
    req.body.user = req.user.userId;
    const product = await Product.create(req.body)

    res.status(StatusCodes.CREATED).json({product: product})
}

const getAllProducts = async (req, res) => {
    const products = await Product.find({})    
    res.status(StatusCodes.OK).json({
        NoOfProdcuts: products.length,
        products: products
    })
}

const getSingleProduct = async (req, res) => {
    const { id: productId } = req.params
    const product = await Product.findOne({ _id: productId }).populate('reviews')
    if (!product) {
        throw new CustomError.NotFoundError(`No product with id: ${productId}`)
    }
    res.status(StatusCodes.OK).json({
        msg: 'Product found',
        product: product
    })
}

const uploadImage = async (req, res) => {
    //....Check the product to be linked to the image...
    const { id: productId } = req.params
    const product = await Product.findOne({_id: productId})
    if (!product) {
        throw new CustomError.NotFoundError(`No product with id: ${productId}`)
    }
    //....Check the image uploaded
    if (!req.files) {
        throw new CustomError.BadRequestError('No file uploaded')
    }
    const productImage = req.files.image
    if (!productImage.mimetype.startsWith('image')) {
        throw new CustomError.BadRequestError('Please upload image')
    }
    const maxSize = 1024 * 1024 * 5
    if (productImage.size > maxSize) {
        throw new CustomError.BadRequestError('Product image cannot be greater than 5MB')
    }
    //....Upload the image to cloudinary
    const tempPath = req.files.image.tempFilePath
    const result = await cloudinary.uploader.upload(tempPath, {
        use_filename: true,
        folder: 'file-upload'
    })
    //....Free temp storage on server
    fs.unlinkSync(tempPath)
    //....link product to image url
    product.image = result.secure_url
    //....Save modified product to dataBase
    await product.save()
    //....Send back product with new image url
    return res.status(StatusCodes.OK).json({
        product: product
    })
    //res.send('uploadImage')
}

const updateProduct = async (req, res) => {
    const {
        id: productId
    } = req.params
    
    const product = await Product.findOneAndUpdate(
        { _id: productId },
        req.body,
        {
            runValidators: true,
            new: true
        }
    )

    if (!product) {
        throw new CustomError.NotFoundError(`No product with id: ${productId}`)
    }
    res.status(StatusCodes.OK).json({ msg: 'Product Update', Product: product })
}

const deleteProduct = async (req, res) => {
    const {
        id: productId
    } = req.params

    const product = await Product.findOne({ _id: productId })
    if (!product) {
        throw new CustomError.NotFoundError('Product Does not exist')
    }
    await product.remove()
    res.status(StatusCodes.OK).json(
        {
            msg: 'Success!!! Product removed'
        })
}

module.exports = {
    getAllProducts,
    getSingleProduct,
    createProduct,
    uploadImage,
    updateProduct,
    deleteProduct
}