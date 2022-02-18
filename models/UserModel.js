const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide name"],
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: [true, "Please provide email"],
        unique:true,
        validate: {
            message: 'Please provide valid email',
            validator: validator.isEmail
        }
    },
    password: {
        type: String,
        required: [true, "Please provide password"],
        minlength: 6
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
        
    }
})

//Schema.pre is called a hook
UserSchema.pre('save', async function () {
//console.log(this.isModifiedPaths()) ---- prints what values have been modified
//console.log(this.isModified('name')) ---- prints true/false depending upon if given
//                                      ---- property has been modified
    //----if password is not modified dont execute hashing and just return
    if (!this.isModified('password')) {
        console.log("password not modified");
        return
    }
    
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.comparePassword = async function (candidatePassword){
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch;
}
module.exports = mongoose.model("User", UserSchema)