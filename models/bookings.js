const mongoose = require("mongoose")
const Cab = require("./cabs")

const bookingSchema = new mongoose.Schema({
    "from": {
        "type": String,
        "required": true,
        "trim": true
    }, "to": {
        "type": String,
        "trim": true
    }, "completed": {
        "type": Boolean,
        "default": false
    }, "owner": {
        "type": mongoose.Schema.Types.ObjectId,
        "required": true,
        "ref": "User"
    }, "cab": {
        "type": mongoose.Schema.Types.ObjectId,
        "required": true,
        "ref": "Cab"
    }
}, {
    "timestamps": true
})

const Booking = mongoose.model("Booking", bookingSchema)

async function bookCab(obj) {
    const cabs = await Cab.nearbyCabs(obj.from)
    if (cabs.length == 0) { throw new Error("No cabs are available") }
    return Booking({ ...obj, cab: cabs[0]._id }).save()
}

function bookingHistory(owner) { return Booking.find({ owner }) }

module.exports = { Booking, bookCab, bookingHistory }