const Category = require('../models/categoryModel')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')

const createCategory = async (req, res) => {
    const category = await Category.create(req.body)

    res.status(StatusCodes.CREATED).json({
        "create category": category
    })
}

module.exports = {createCategory}