const User = require('../models/UserModel')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const bcrypt = require('bcryptjs')
const { createTokenUser, attachCookiesToResponse, checkPermissions } = require('../utils')

const getAllUsers = async (req, res) => {
    let users = await User.find({ role: 'user' }).select('-password')
    
    res.status(StatusCodes.OK).json({
        "Number of users: ": users.length,
        "Users": users
    })

}

const getSingleUser = async (req, res) => {
    
    const userId = req.params.id
    
    const user = await User.findOne({ _id: userId }).select('-password')
    if (!user) {
        throw new CustomError.BadRequestError(`No user with id: ${userId}`)
    }
    checkPermissions(req.user, user._id)

    res.status(StatusCodes.OK).json({user})
}

const showCurrentUser = async (req, res) => {
    res.status(StatusCodes.OK).json({user: req.user})
}

const updateUser = async (req, res) => {
    //console.log(req.body)
    const { email, name } = req.body
    if (!email || !name) {
        throw new CustomError.BadRequestError("please provide both email and passwor")
    }
    const user = await User.findOne({_id: req.user.userId})
    user.email = email
    user.name = name.trim()
    await user.save()
    const tokenUser = createTokenUser(user)
    attachCookiesToResponse({res,user:tokenUser})
    //console.log(user)
    res.status(StatusCodes.OK).json({user: tokenUser})
}

const updateUserPassword = async (req, res) => {
    const {oldPassword, newPassword} = req.body
    if (!oldPassword || !newPassword) {
        throw new CustomError.BadRequestError("Please provide old and new password")
    }
    
    const user = await User.findById(req.user.userId)
    console.log(user)
    const isPasswordCorrect = await user.comparePassword(oldPassword)
    if (!isPasswordCorrect) {
        throw new CustomError.UnauthenticatedError("Wrong password")
    }
    // const salt = await bcrypt.genSalt(10)
    // const hashedPassword = await bcrypt.hash(newPassword, salt)
    // const updateUser = await User.updateOne({_id:req.user.userId}, {
    //     password: hashedPassword
    // });
    user.password = newPassword
    await user.save()

    res.status(StatusCodes.OK).json({msg: "Password has been modified"})    
}

module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
}

// modify user through find one and update
// const updateUser = async (req, res) => {
    // console.log(req.body)
    // const {
        // email,
        // name
    // } = req.body
    // if (!email || !name) {
        // throw new CustomError.BadRequestError("please provide both email and passwor")
    // }
    // const user = await User.findOneAndUpdate({
        // _id: req.user.userId
    // }, {
        // email,
        // name
    // }, {
        // new: true,
        // runValidators: true
    // })
    // const tokenUser = createTokenUser(user)
    // attachCookiesToResponse({
        // res,
        // user: tokenUser
    // })
    // console.log(user)
    // res.status(StatusCodes.OK).json({
        // user: tokenUser
    // })
// }