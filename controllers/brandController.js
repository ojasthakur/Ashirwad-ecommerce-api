const Brand = require('../models/brandModel')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')

const createBrand = async (req, res) => {
    const brand = await Brand.create(req.body)

    res.status(StatusCodes.CREATED).json({
        "create brand": brand
    })
}

const getAllBrands = async (req, res) => {
    const brands = await Brand.find({})
    res.status(StatusCodes.OK).json(
        {
            "No. of Brands": brands.length,
            Brands: brands
        }
    )
}

const updateBrand = async (req, res) => {
    const { id: brandId } = req.params

    const brand = await Brand.findOneAndUpdate({ _id: brandId }, req.body, {
        runValidators: true, 
        new: true
    })
    if (!brand) {
        throw new CustomError.NotFoundError(`No Brand with id: ${brandId}`)
    }

    res.status(StatusCodes.OK).json({
        msg: "Brand updated",
        "Updated Brand": brand
    })
}
module.exports = {createBrand, getAllBrands, updateBrand}