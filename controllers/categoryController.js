const Category = require('../models/categoryModel')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')

const createCategory = async (req, res) => {
    const category = await Category.create(req.body)

    res.status(StatusCodes.CREATED).json({
        "create category": category
    })
}

const getAllCategories = async (req, res) => {
    const categories = await Category.find({})
    res.status(StatusCodes.OK).json(
        {
            "No. of categories": categories.length,
            Categories: categories
        }
    )
}

const updateCategory = async (req, res) => {
    const { id: categoryId } = req.params

    const category = await Category.findOneAndUpdate({ _id: categoryId }, req.body, {
        runValidators: true, 
        new: true
    })
    if (!category) {
        throw new CustomError.NotFoundError(`No category with id: ${categoryId}`)
    }

    res.status(StatusCodes.OK).json({
        msg: "Category updated",
        "Updated Category": category
    })
}
module.exports = {createCategory, getAllCategories, updateCategory}