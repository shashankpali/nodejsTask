const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Cab = require("./cabs")


const userSchema = new mongoose.Schema({
    "name": {
        "type": String,
        "required": true,
        "trim": true,
    },  "email": {
        "type": String,
        "unique": true,
        "trim": true,
        "required": true,
        "lowercase": true,
    }, "password": {
        "type": String,
        "required": true,
        "trim": true,
        "minlength": 7,
    }, "cab": {
        "type": mongoose.Schema.Types.ObjectId,
        "required": false,
        "ref": "Cab"
    }, "tokens": [{
        "token": {
            "type": String,
            "required": true
        }
    }]
}, {
    "timestamps": true
})

userSchema.pre("save", async function (next) {
    const user = this
    if (user.isModified("password")) { user.password = await bcrypt.hash(user.password, 8) }
    next()
})

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ "_id" : user._id.toString() }, "authKey")
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.methods.toJSON = function () {
    const userObj = this.toObject()
    delete userObj.password
    delete  userObj.tokens
    return userObj
}

const User = mongoose.model("User", userSchema)


async function verifyCredentials(email, password) { 
    const user = await User.findOne({ email })
    if (!user) { throw new Error("Create new account with this email") }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) { throw new Error("Either email or password is incorrect") }

    return user
}

async function createUser(obj) {
    if (obj.isDriver) {
        const cab = await Cab.createCab({ "currentLocation": obj.currentLoc })
        return User({ ...obj, cab: cab._id }).save()    
    }
    return User(obj).save()
}

module.exports = { User,  verifyCredentials, createUser}