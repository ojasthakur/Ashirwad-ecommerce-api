const User = require('../models/UserModel')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const jwt = require('jsonwebtoken')
const {
    createJwt,
    attachCookiesToResponse,
    createTokenUser
} = require('../utils')

const { token } = require('morgan')

const register = async (req, res) => {
    // console.log(req.body)
    const { name, email, password } = req.body
    const user = await User.create({ name, email, password })
    
    const tokenUser = createTokenUser(user)
    //const token = createJwt({payload: tokenUser})
    
    //....Below Function attaches cookies to our response
    attachCookiesToResponse({res, user:tokenUser})


    res.status(StatusCodes.CREATED).json({ user: tokenUser })
}

const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        throw new CustomError.BadRequestError("Please provide email and password")
    }
    
    const user = await User.findOne({email})
    if (!user) {
        throw new CustomError.UnauthenticatedError("Invalid Credentials")
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new CustomError.UnauthenticatedError("Wrong password")
    }
    
    const tokenUser = createTokenUser(user)
    attachCookiesToResponse({res, user:tokenUser})
    
    res.status(StatusCodes.OK).    json({ user: tokenUser })
}
const logout = async (req, res) => {
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now())
    })
    res.status(StatusCodes.OK).json({msg: "Logged Out"})
}

module.exports = {register, login, logout}