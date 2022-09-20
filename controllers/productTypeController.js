const ProductType = require('../models/productTypeModel')
const Category = require('../models/categoryModel')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')

const createProductType = async (req, res) => {
    const productType = await ProductType.create(req.body)

    res.status(StatusCodes.CREATED).json({
        "ProductType Created": productType
    })
}

const getAllProductTypesOfCategory = async (req, res) => {

    const {categoryId } = req.body
    if (!categoryId) {
        throw new CustomError.NotFoundError(`No category id given`)
    }
    const category = await Category.find({ _id: categoryId })
    if (!category) {
        throw new CustomError.NotFoundError(`No category with id: ${categoryId}`)
    }

    const productTypes = await ProductType.find({ category: categoryId })


    res.status(StatusCodes.OK).json(
        {
            "No. of Product Types for given Category": productTypes.length,
            productTypes: productTypes
        }
    )
}

const updateProductType = async (req, res) => {
    const { id: productTypeId } = req.params

    const productType = await ProductType.findOneAndUpdate({ _id: productTypeId }, req.body, {
        runValidators: true, 
        new: true
    })
    if (!productType) {
        throw new CustomError.NotFoundError(`No ProductType with id: ${productTypeId}`)
    }

    res.status(StatusCodes.OK).json({
        msg: "ProductType updated",
        "Updated ProductType": ProductType
    })
}
module.exports = {createProductType, getAllProductTypesOfCategory, updateProductType}