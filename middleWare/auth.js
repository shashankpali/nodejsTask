const jwt = require("jsonwebtoken")
const User = require("../models/users")

module.exports = async function auth(req, res, next) {
    try {
        const token = req.header("Authorization").replace("Bearer ", "")
        const decoded = jwt.verify(token, "authKey")
        const user = await User.User.findOne({"_id" : decoded._id, "tokens.token": token})
        if (!user) { throw new Error("ReLogin")}
        req.user = user
            req.token = token
            next()
    } catch (error) {
        res.status(401).send("Authentification fails") 
    }
}