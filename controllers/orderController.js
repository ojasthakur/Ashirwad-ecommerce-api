const Product = require('../models/productModels')
const Order = require('../models/orderModel')

const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const { checkPermissions } = require('../utils/')
const { reset } = require('nodemon')
const { custom } = require('joi')

const fakeStripeApi = async ({ amount, currency }) => {
    const client_secret = 'someRandomValue'
    return { client_secret, amount } 
}

const createOrder = async (req, res) => {
    const { items: cartItems, tax, shippingFee } = req.body

    if (!cartItems || cartItems.length < 1) {
        throw new CustomError.BadRequestError('No Items is cart')
    }
    if (!tax || !shippingFee) {
        throw new CustomError.BadRequestError('Please provide tax and shipping fee')
    }

    let orderItems = []
    let subTotal = 0;
    for (const item of cartItems) {
        const dbProduct = await Product.findOne({ _id: item.product })
        if (!dbProduct) {
            throw new CustomError.NotFoundError(`No product with id: ${item.product}`)
        }
        const { name, price, _id } = dbProduct
        const singleOrderItem = {
            amount: item.amount,
            name,
            price,
            product: _id
        }
        //Add item to order
        orderItems.push(singleOrderItem)
        //calculate subTotal
        subTotal += item.amount*price
    }
    //calculate total before going to payment
    const total = subTotal + tax + shippingFee
    //get client secret
    const paymentIntent = await fakeStripeApi({
        amount: total,
        currency: 'usd'
    })
    //now we want to create the order
    const order = await Order.create({
        orderItems,
        total,
        subTotal,
        tax,
        shippingFee,
        clientSecret: paymentIntent.client_secret,
        user: req.user.userId
    })
    res.status(StatusCodes.CREATED).json({order, clientSecret: order.clientSecret })
}   

const getAllOrders = async (req, res) => {
    const allOrders = await Order.find({})
    if (!allOrders) {
        throw new CustomError.NotFoundError('No orders exist')
    }
    res.status(StatusCodes.OK).json({
        orderCount: allOrders.length,
        orders : allOrders
    })
}
const getSingleOrder = async (req, res) => {
    const { id: orderId } = req.params
    const order = await Order.findOne({ _id: orderId })
    if (!order) {
        throw new CustomError.NotFoundError(`No order with id: ${orderId}`)
    }
    checkPermissions(req.user, order.user)
    res.status(StatusCodes.OK).json({ order: order })
}
const getCurrentUserOrders = async (req, res) => {
    const currentUserId = req.user.userId
    const orders = await Order.find({user: currentUserId})
    //console.log(currentUserId, typeof(currentUserId))
    if (!orders) {
        throw new CustomError.NotFoundError(`No order for user: ${currentUserId}`)
    }
    res.status(StatusCodes.OK).json({
        orderCount: orders.length,
        orders
    })
}
const updateOrder = async (req, res) => {
    const { id: orderId } = req.params
    const { paymentIntentId } = req.body
    if (!paymentIntentId) {
        throw new CustomError.BadRequestError('No payment intent id found')
    }
    const order = await Order.findOne({ _id: orderId })
    if (!order) {
        throw new CustomError.NotFoundError(`No order with id:${orderId}`)
    }
    checkPermissions(req.user, order.user)
    order.paymentIntentId = paymentIntentId
    order.status = 'paid'
    console.log(order)
    await order.save()
    
    res.status(StatusCodes.OK).json({order})
    
}

module.exports = {
    createOrder,
    getAllOrders,
    getSingleOrder,
    updateOrder,
    getCurrentUserOrders

}