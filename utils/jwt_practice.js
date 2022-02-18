const jwt = require('jsonwebtoken')
require('dotenv').config()
const payload = {
    name: 'Ojas',
    id: 123,
    secret: 3434
}
const token = jwt.sign(payload, 'secret', {
   expiresIn: '30d'
})
let tokenArr = token.split('')
//console.log(tokenArr)
console.log(token)
tokenArr.pop()
tokenArr.push('Y')
let token2 = tokenArr.join('')
console.log(token2)
const result = jwt.verify(token2, 'secret')
console.log(result)