require('dotenv').config()
require('express-async-errors')
//....EXPRESS....
const express = require('express')
const app = express()

//....REST OF THE PACKAGES....
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const expressFileUpload = require('express-fileupload')
const cloudinary = require('cloudinary').v2

const rateLimiter = require('express-rate-limit')
const helmet = require('helmet')
const xss = require('xss-clean')
const cors = require('cors')
const mongoSanitize = require('express-mongo-sanitize')

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})


//....ROUTERS....
const authRouter = require('./routes/authRouter')
const userRouter = require('./routes/userRoutes')
const productRouter = require('./routes/productRoutes')
const reviewRouter = require('./routes/reviewRoutes')
const orderRouter = require('./routes/orderRoutes')

//....DATABASE....
const connectDB = require('./db/connect')

//....IMPORT MIDDLEWARES
const errorHandlerMiddleware = require('./middleware/error-handler')
const notFoundMiddleware = require('./middleware/not-found')

//....MIDDLEWARES.....
app.set('trust proxy', 1)
app.use(rateLimiter({
    windowsMs: 15 * 60 * 1000,
    max:100
}))
app.use(helmet())
app.use(cors({
    // origin: '*',
    // origin: 'http://localhost:3000',
    // optionsSuccessStatus: 200,
}))
app.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next()
  });
app.use(xss())
app.use(mongoSanitize())

app.use(morgan('tiny'))
//....EXPRESS.JSON -> TO ACCESS JSON DATA IN REQ.BODY   
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))

app.use(express.static('./public'))
app.use(expressFileUpload({useTempFiles: true}))



//....ROUTES....


app.get('/', (req, res) => {
    //console.log(req.cookies)
    res.send("Home Page X")   
})
// app.get('/api/v1', (req, res) => {
    // console.log(req.cookies)
    // console.log(req.signedCookies);
    // res.send("Home Page X")
// })
   
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users',userRouter)
app.use('/api/v1/products',productRouter)
app.use('/api/v1/reviews', reviewRouter)
app.use('/api/v1/orders', orderRouter)
app.use('/testing_route', (req, res) => {
    res.send('This is the write foler!')
})
//USE ERROR HANDLER AND NOT FOUND MIDDLEWARE AT THE END
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)


const port = process.env.PORT || 3000
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`ecommerce Server listening on port ${port}`))
    } catch (error) {
        console.log(error)
    }
}

start()